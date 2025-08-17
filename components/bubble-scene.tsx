"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePlane } from "@react-three/cannon"
import * as THREE from 'three'
import Bubble from "./bubble"
import { getMotivationBiohacks } from "@/lib/admin"

interface BubbleSceneProps {
  activeTab: "lifestyle" | "feel-good"
  motivationId: number | null
  onBubbleClick: (biohack: { id: number; title: string }) => void
}

export default function BubbleScene({ activeTab, motivationId, onBubbleClick }: BubbleSceneProps) {
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

  // Fetch biohacks for the selected motivation
  const [biohacks, setBiohacks] = useState<any[]>([])
  const [loadedMotivationId, setLoadedMotivationId] = useState<number | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (!motivationId || loadingRef.current) return
    loadingRef.current = true
    ;(async () => {
      try {
        const data = await getMotivationBiohacks(motivationId)
        setBiohacks(Array.isArray(data) ? data : [])
        setLoadedMotivationId(motivationId)
      } catch (e) {
        setBiohacks([])
      } finally {
        loadingRef.current = false
      }
    })()
  }, [motivationId])

  // Map biohacks to bubble configs
  const palette = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#14b8a6", "#f97316", "#84cc16"]
  const positions: [number, number, number][] = useMemo(() => {
    // Predefined aesthetically placed positions within walls
    return [
      [-3, 2, 0], [3, -1, 1], [-2, -2, -1], [2, 2, -2], [-1, 0, 2], [4, 0, 0], [-4, -1, 1], [1, -3, -1],
      [-3.5, 1.5, 0.5], [2.5, -2, -0.5], [-1.5, -1.2, 1.2], [1.8, 2.5, 0.8]
    ]
  }, [])

  const byTab = useMemo(() => {
    const short = biohacks.filter(b => String(b.timeRequired || '').toLowerCase().includes('short'))
    const long = biohacks.filter(b => String(b.timeRequired || '').toLowerCase().includes('long'))
    const pick = (arr: any[]) => arr.slice(0, 12).map((b, i) => ({
  id: b.id ?? i,
      color: palette[i % palette.length],
      position: positions[i % positions.length],
      size: 1.3 + Math.min(Math.max((Array.isArray(b.action) ? b.action.length : 3), 3), 10) * 0.06,
      // Use title as the bubble label
      content: b.title || b.technique || 'Biohack'
    }))
    return { feelGood: pick(short), lifestyle: pick(long) }
  }, [biohacks, palette, positions])

  const bubbleConfigs = activeTab === 'lifestyle' ? byTab.lifestyle : byTab.feelGood

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
          id={config.id}
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
