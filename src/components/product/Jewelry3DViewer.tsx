"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Ensure all meshes cast/receive shadows and use correct encoding
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function Fallback() {
  return (
    <mesh>
      <torusGeometry args={[1, 0.35, 32, 64]} />
      <meshStandardMaterial color="#c9a962" metalness={0.9} roughness={0.15} />
    </mesh>
  );
}

interface Props {
  modelUrl: string;
  fallbackImageUrl?: string;
  label?: string;
}

export function Jewelry3DViewer({ modelUrl, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);

  useEffect(() => {
    track({ event_name: EVENTS.VIEWER_3D_OPEN });
  }, []);

  function handleInteract() {
    if (!interacted.current) {
      interacted.current = true;
      track({ event_name: EVENTS.VIEWER_3D_INTERACT });
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handleInteract}
      className="relative aspect-square w-full max-w-md overflow-hidden border border-ivory/10 bg-gradient-to-b from-ink-muted to-ink-deep"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#d4c4a8" />
        <pointLight position={[0, 4, 0]} intensity={0.6} color="#c9a962" />

        <Suspense fallback={<Fallback />}>
          <Model url={modelUrl} />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1.2}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Corner label */}
      <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center">
        <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/30">{label ?? "360° View · Drag to rotate"}</p>
      </div>

      {/* Subtle gold vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(10,10,9,0.6) 100%)",
        }}
        aria-hidden
      />
    </div>
  );
}
