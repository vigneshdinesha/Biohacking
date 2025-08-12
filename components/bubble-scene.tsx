"use client"

import { useMemo } from "react"
import { usePlane } from "@react-three/cannon"
import * as THREE from 'three'
import Bubble from "./bubble"

interface BubbleSceneProps {
  activeTab: "lifestyle" | "feel-good"
  onBubbleClick: (content: string) => void
}

export default function BubbleScene({ activeTab, onBubbleClick }: BubbleSceneProps) {
  // Create invisible walls for bouncing
  const [bottomWall] = usePlane<THREE.Mesh>(() => ({
    position: [0, -5, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }))
  const [topWall] = usePlane<THREE.Mesh>(() => ({
    position: [0, 5, 0],
    rotation: [Math.PI / 2, 0, 0],
  }))
  const [leftWall] = usePlane<THREE.Mesh>(() => ({
    position: [-8, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  }))
  const [rightWall] = usePlane<THREE.Mesh>(() => ({
    position: [8, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  }))
  const [backWall] = usePlane<THREE.Mesh>(() => ({
    position: [0, 0, -5],
    rotation: [0, 0, 0],
  }))
  const [frontWall] = usePlane<THREE.Mesh>(() => ({
    position: [0, 0, 5],
    rotation: [0, Math.PI, 0],
  }))

  // Reduced number of bubbles from 12 to 8
  const bubbleConfigs = useMemo(() => {
    if (activeTab === "lifestyle") {
      return [
        { id: 1, color: "#10b981", position: [-3, 2, 0], size: 1.5, content: "Feel more alert for 2 hours" },
        { id: 2, color: "#06b6d4", position: [3, -1, 1], size: 1.8, content: "Boost focus naturally" },
        { id: 3, color: "#8b5cf6", position: [-2, -2, -1], size: 1.6, content: "Optimize sleep cycles" },
        { id: 4, color: "#f59e0b", position: [2, 2, -2], size: 1.4, content: "Increase energy levels" },
        { id: 5, color: "#ef4444", position: [-1, 0, 2], size: 1.7, content: "Enhance metabolism" },
        { id: 6, color: "#14b8a6", position: [4, 0, 0], size: 1.3, content: "Cold exposure therapy" },
        { id: 7, color: "#f97316", position: [-4, -1, 1], size: 1.6, content: "Intermittent fasting" },
        { id: 8, color: "#84cc16", position: [1, -3, -1], size: 1.5, content: "Morning sunlight" },
      ]
    } else {
      return [
        { id: 1, color: "#22c55e", position: [-2, 2, 0], size: 1.6, content: "Come back to present moment" },
        { id: 2, color: "#3b82f6", position: [3, -1, 1], size: 1.5, content: "Break free from laziness" },
        { id: 3, color: "#a855f7", position: [-3, -2, -1], size: 1.8, content: "Reduce stress naturally" },
        { id: 4, color: "#f97316", position: [1, 2, -2], size: 1.4, content: "Improve mental clarity" },
        { id: 5, color: "#ec4899", position: [0, -1, 2], size: 1.7, content: "Balance hormones" },
        { id: 6, color: "#10b981", position: [4, 1, 0], size: 1.3, content: "Mindful meditation" },
        { id: 7, color: "#f59e0b", position: [-4, 0, 1], size: 1.5, content: "Digital detox" },
        { id: 8, color: "#06b6d4", position: [2, -3, -1], size: 1.6, content: "Forest bathing" },
      ]
    }
  }, [activeTab])

  return (
    <>
      {/* Invisible walls */}
      <mesh ref={bottomWall} visible={false} />
      <mesh ref={topWall} visible={false} />
      <mesh ref={leftWall} visible={false} />
      <mesh ref={rightWall} visible={false} />
      <mesh ref={backWall} visible={false} />
      <mesh ref={frontWall} visible={false} />

      {/* Bubbles */}
      {bubbleConfigs.map((config) => (
        <Bubble
          key={`${activeTab}-${config.id}`}
          position={config.position as [number, number, number]}
          color={config.color}
          size={config.size}
          content={config.content}
          onBubbleClick={onBubbleClick}
        />
      ))}
    </>
  )
}
