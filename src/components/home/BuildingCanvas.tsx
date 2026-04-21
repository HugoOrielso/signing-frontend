import { ContactShadows, Environment, Float, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { HouseModel } from "./3d/house";

export function BuildingCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [4, 3, 6], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <pointLight position={[-4, 3, -4]} intensity={1.2} color="#6080ff" />
        <pointLight position={[0, 2, 3]} intensity={0.8} color="#ffcc66" />

        <Suspense fallback={null}>
          <Float speed={1.4} floatIntensity={0.22} rotationIntensity={0.08}>
            <HouseModel />
          </Float>

          <ContactShadows
            opacity={0.45}
            blur={2.5}
            position={[0, -1.22, 0]}
            scale={8}
          />

          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.0}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}