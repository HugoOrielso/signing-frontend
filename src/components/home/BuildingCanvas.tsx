"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei";
import { HouseModel } from "./3d/house";


export function BuildingCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.8, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} />

      <Environment preset="city" />

      <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.35}>
        <HouseModel />
      </Float>

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.35}
        scale={10}
        blur={2.8}
        far={4.5}
      />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={7}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </Canvas>
  );
}