"use client";

/**
 * RingRenderer3D
 *
 * Mounts a transparent Three.js canvas absolutely on top of the webcam canvas.
 * Reads finger anchor data (x, y in [0,1] NDC, angle in radians, size in px)
 * from a shared ref updated by MediaPipe in the parent.
 *
 * Key coordinate mapping:
 * - webcam canvas internal resolution: video.videoWidth × video.videoHeight (e.g. 1280×720)
 * - webcam canvas CSS display size: from getBoundingClientRect() on the <canvas> element
 * - The <canvas> uses object-contain + mx-auto so it may have letterbox space within
 *   its CSS box — but since the canvas aspect matches the video, there's no actual
 *   letterboxing inside the canvas element itself (the canvas draws exactly to its edges)
 * - Container uses min-h-[480px] so has different origin than the canvas
 * - Fix: position the Three.js renderer element using the canvas rect relative to the
 *   container rect, not assuming inset-0 matches the canvas.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface FingerAnchor {
  /** normalised [0,1] within the video canvas */
  nx: number;
  ny: number;
  /** finger angle in radians (already adjusted for ring orientation) */
  angle: number;
  /** ring diameter in canvas pixels */
  sizePx: number;
  /** canvas pixel dimensions at time of measurement */
  canvasW: number;
  canvasH: number;
}

interface Props {
  modelPath: string;
  anchorRef: React.RefObject<FingerAnchor | null>;
  /** CSS-pixel dimensions of the sibling canvas — used to size this overlay */
  webcamCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  opacity: number;
  /** Extra uniform scale multiplier (from the size slider, default 1) */
  scaleMultiplier: number;
  onError: (msg: string) => void;
}

export function RingRenderer3D({
  modelPath,
  anchorRef,
  webcamCanvasRef,
  opacity,
  scaleMultiplier,
  onError,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;

    const domEl = renderer.domElement;
    domEl.style.position = "absolute";
    domEl.style.pointerEvents = "none";
    // Will be positioned precisely in syncSize()
    mount.appendChild(domEl);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // Soft directional key light
    const keyLight = new THREE.DirectionalLight(0xfff5e0, 3.5);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    // Fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xd0c0ff, 1.2);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);

    // Subtle warm rim
    const rimLight = new THREE.DirectionalLight(0xffd080, 0.8);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Ambient so shadow areas aren't dead black
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // ── Camera ────────────────────────────────────────────────────────────────
    // Orthographic keeps the ring pixel-accurate regardless of depth.
    // We'll update the frustum every frame to match canvas dimensions.
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 1000);
    camera.position.set(0, 0, 10);

    // ── Load GLB ──────────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    let ringGroup: THREE.Group | null = null;
    let loadError = false;

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Centre the model on its own bounding box
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        model.position.sub(centre);

        // Wrap in a group so we can rotate/scale the group without fighting
        // the model's internal transform
        const group = new THREE.Group();
        group.add(model);

        // Enhance materials for metallic look
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.metalness = Math.max(m.metalness, 0.85);
                m.roughness = Math.min(m.roughness, 0.25);
                m.envMapIntensity = 1.4;
                m.needsUpdate = true;
              }
            });
          }
        });

        // Normalise model so its widest axis spans 1 world unit
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const normalise = 1 / maxDim;
        group.scale.setScalar(normalise);

        scene.add(group);
        ringGroup = group;
        setLoaded(true);
      },
      undefined,
      (err) => {
        loadError = true;
        console.error("GLB load error", err);
        onError(`Failed to load 3D model: ${modelPath}. Check the file exists and is a valid GLB.`);
      }
    );

    // ── Resize sync ───────────────────────────────────────────────────────────
    // cw/ch = CSS pixel dimensions of the webcam canvas (the Three.js viewport)
    // offsetX/offsetY = CSS pixel offset of webcam canvas top-left within the mount div
    let cw = 0, ch = 0, offsetX = 0, offsetY = 0;

    function syncSize() {
      const wc = webcamCanvasRef.current;
      if (!wc || !mount) return;

      const canvasRect = wc.getBoundingClientRect();
      const mountRect = mount.getBoundingClientRect();

      cw = canvasRect.width;
      ch = canvasRect.height;
      // Offset of canvas top-left relative to mount top-left
      offsetX = canvasRect.left - mountRect.left;
      offsetY = canvasRect.top - mountRect.top;

      renderer.setSize(cw, ch);

      // Position the Three.js canvas to exactly overlay the webcam canvas
      domEl.style.left = `${offsetX}px`;
      domEl.style.top = `${offsetY}px`;
      domEl.style.width = `${cw}px`;
      domEl.style.height = `${ch}px`;

      // Orthographic frustum: 1 world unit = 1 CSS pixel
      camera.left   = -cw / 2;
      camera.right  =  cw / 2;
      camera.top    =  ch / 2;
      camera.bottom = -ch / 2;
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(syncSize);
    if (webcamCanvasRef.current) ro.observe(webcamCanvasRef.current);
    // Also observe mount to detect container shifts
    ro.observe(mount);
    syncSize();

    // ── Render loop ───────────────────────────────────────────────────────────
    let rafId = 0;

    function tick() {
      rafId = requestAnimationFrame(tick);
      if (!ringGroup || loadError) return;

      const anchor = anchorRef.current;
      if (!anchor || anchor.canvasW === 0) {
        ringGroup.visible = false;
        renderer.render(scene, camera);
        return;
      }

      // Re-sync size if canvas changed (e.g. user resized)
      const wc = webcamCanvasRef.current;
      if (wc) {
        const canvasRect = wc.getBoundingClientRect();
        if (
          Math.abs(canvasRect.width - cw) > 0.5 ||
          Math.abs(canvasRect.height - ch) > 0.5
        ) {
          syncSize();
        }
      }

      // anchor.nx/ny are in [0,1] of the webcam canvas internal resolution.
      // The Three.js canvas now exactly overlays the webcam canvas in CSS pixels.
      // Convert: normalized -> CSS px within webcam canvas -> Three.js world units.
      // Three.js world origin is at canvas center, +x right, +y up.
      //
      // No mirror correction needed: canvas draws raw video (no CSS scaleX(-1)),
      // and MediaPipe runs on the same raw video — both share unmirrored coordinates.
      const worldX = (anchor.nx - 0.5) * cw;
      const worldY = (0.5 - anchor.ny) * ch;

      // sizePx is in canvas-internal pixels; scale to CSS px
      const scaleX = cw / anchor.canvasW;
      const ringCSSPx = anchor.sizePx * scaleX;
      const ringScale = ringCSSPx * scaleMultiplier;

      ringGroup.visible = true;
      ringGroup.position.set(worldX, worldY, 0);
      ringGroup.scale.setScalar(ringScale);
      ringGroup.rotation.z = anchor.angle;

      // Apply opacity to all meshes
      ringGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            (m as THREE.Material).opacity = opacity;
            (m as THREE.Material).transparent = opacity < 1;
          });
        }
      });

      renderer.render(scene, camera);
    }

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(domEl)) mount.removeChild(domEl);
    };
  // Re-mount only when modelPath changes (the anchor/opacity/scale are read via refs/props each frame)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
    />
  );
}
