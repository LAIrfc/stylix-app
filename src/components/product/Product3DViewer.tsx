"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/tracker";

interface Product3DViewerProps {
  modelUrl?: string | null;
  fallbackImageUrl: string;
  productName: string;
  productId?: string;
}

function FallbackImage({
  fallbackImageUrl,
  productName,
}: {
  fallbackImageUrl: string;
  productName: string;
}) {
  return (
    <div
      className="relative aspect-square w-full max-w-md overflow-hidden border border-ivory/10 bg-ink-soft"
      data-product-3d-fallback
    >
      <Image
        src={fallbackImageUrl}
        alt={productName}
        fill
        className="object-contain object-center"
        sizes="(min-width: 1024px) 28rem, 100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,5,5,0.58)_100%)]" />
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[9px] uppercase tracking-[0.35em] text-ivory/30">
        Product image
      </p>
    </div>
  );
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;

    const mesh = child as THREE.Mesh;
    mesh.geometry.dispose();

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      material.dispose();
    }
  });
}

export function Product3DViewer({
  modelUrl,
  fallbackImageUrl,
  productName,
  productId,
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);
  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!modelUrl || trackedRef.current) return;
    trackedRef.current = true;
    track({ event_name: EVENTS.VIEW_3D_OPEN, product_id: productId });
  }, [modelUrl, productId]);

  useEffect(() => {
    if (!modelUrl || !mountRef.current) return;

    let frameId = 0;
    let model: THREE.Object3D | null = null;
    let disposed = false;

    setLoadError(false);
    setLoaded(false);

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.3, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;

    scene.add(new THREE.AmbientLight(0xf5f0e8, 0.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4c4a8, 1.2);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xc9a962, 1.8, 8);
    fillLight.position.set(0, 2.5, 2);
    scene.add(fillLight);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;

        model = gltf.scene;
        model.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.45 / maxSize;

        model.position.sub(center);
        model.scale.setScalar(scale);
        scene.add(model);
        setLoaded(true);
      },
      undefined,
      (error) => {
        console.error("[Product3DViewer] Failed to load model", { modelUrl, error });
        if (!disposed) setLoadError(true);
      }
    );

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      if (model) disposeObject(model);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [modelUrl]);

  if (!modelUrl || loadError) {
    return (
      <FallbackImage
        fallbackImageUrl={fallbackImageUrl}
        productName={productName}
      />
    );
  }

  return (
    <div className="relative aspect-square w-full max-w-md overflow-hidden border border-ivory/10 bg-gradient-to-b from-ink-muted to-ink-deep">
      <div ref={mountRef} className="absolute inset-0" data-product-3d-viewer />
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border border-gold/20 border-t-gold/80" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_56%,rgba(5,5,5,0.62)_100%)]" />
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[9px] uppercase tracking-[0.35em] text-ivory/30">
        360 view · drag to rotate · pinch to zoom
      </p>
    </div>
  );
}
