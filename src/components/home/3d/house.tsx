"use client";

import { useGLTF } from "@react-three/drei";

export function HouseModel() {
  const { scene } = useGLTF("/assets/Small Building.glb");

  return (
    <primitive
      object={scene}
      scale={2}           // 🔥 más grande
      position={[0, -1.2, 0]} // 🔥 centrado y bien apoyado
    />
  );
}