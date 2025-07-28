"use client"

import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/cannon"
import { Environment, OrbitControls } from "@react-three/drei"
import BubbleScene from "./bubble-scene"

export default function SceneWrapper({ activeTab, onBubbleClick }: { activeTab: "lifestyle" | "feel-good"; onBubbleClick: (content: string) => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ alpha: true, antialias: true }}>
      <Environment preset="sunset" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#87ceeb" />
      <Physics
        gravity={[0, 0, 0]}
        iterations={20}
        defaultContactMaterial={{
          friction: 0.05,
          restitution: 0.9,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 4,
        }}
      >
        <BubbleScene activeTab={activeTab} onBubbleClick={onBubbleClick} />
      </Physics>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  )
}
