"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { Html } from "@react-three/drei"
import * as THREE from "three"

interface BubbleProps {
  position: [number, number, number]
  color: string
  size: number
  content: string
  onBubbleClick: (content: string) => void
}

export default function Bubble({ position, color, size, content, onBubbleClick }: BubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Physics sphere with no gravity - free floating
  const [ref, api] = useSphere(() => ({
    mass: 0.5,
    position,
    args: [size],
    material: {
      restitution: 0.9,
      friction: 0.05,
    },
  }))

  // Add random initial velocity for free floating movement
  useState(() => {
    api.velocity.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
  })

  // Continuous gentle forces for organic movement
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()

      // Gentle rotation
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
      meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1

      // Add gentle floating forces in all directions
      const floatForceX = Math.sin(time * 0.5 + position[0]) * 0.15
      const floatForceY = Math.cos(time * 0.3 + position[1]) * 0.15
      const floatForceZ = Math.sin(time * 0.4 + position[2]) * 0.15

      api.applyForce([floatForceX, floatForceY, floatForceZ], [0, 0, 0])
    }
  })

  return (
    <group
      ref={(group) => {
        // @ts-ignore
        ref.current = group
        meshRef.current = group
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onBubbleClick(content)}
      scale={hovered ? 1.05 : 1}
      style={{ cursor: "pointer" }}
    >
      {/* Main bubble */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.3}
          roughness={0.0}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          transmission={0.8}
          thickness={0.2}
          ior={1.4}
          iridescence={1.0}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          envMapIntensity={2}
        />
      </mesh>

      {/* Shiny rim effect */}
      <mesh>
        <sphereGeometry args={[size * 1.02, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>

      {/* Text integrated into bubble */}
      <Html center distanceFactor={8}>
        <div
          className="pointer-events-auto select-none cursor-pointer"
          style={{
            color: "white",
            fontSize: `${size * 12}px`,
            fontWeight: "bold",
            textAlign: "center",
            maxWidth: `${size * 100}px`,
            lineHeight: "1.1",
            textShadow: "0 0 15px rgba(0,0,0,0.9), 0 0 25px rgba(0,0,0,0.7)",
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
          }}
        >
          {content}
        </div>
      </Html>

      {/* Subtle highlight */}
      <mesh position={[size * 0.3, size * 0.3, size * 0.3]}>
        <sphereGeometry args={[size * 0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
