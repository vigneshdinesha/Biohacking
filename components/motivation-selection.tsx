"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Zap, Heart, Sparkles, Users, HelpCircle, ArrowRight } from "lucide-react"
import { getMotivations } from "@/lib/admin"
import { Skeleton } from "@/components/ui/skeleton"

interface MotivationSelectionProps {
  onSelect: (motivation: { id: number; title: string }) => void
}

// Visual defaults for cards (cycled across fetched motivations)
const DEFAULT_ICONS = [Zap, Heart, Sparkles, Users, HelpCircle]
const DEFAULT_GRADIENTS = [
  "from-blue-400 to-cyan-500",
  "from-red-400 to-pink-500",
  "from-purple-400 to-indigo-500",
  "from-green-400 to-teal-500",
  "from-yellow-400 to-orange-500",
]

function MotivationCard({
  motivation,
  index,
  onSelect,
}: { motivation: any; index: number; onSelect: (value: { id: number; title: string }) => void }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = motivation.icon

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const cardY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
      style={{ y: cardY }}
    >
      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl cursor-pointer group overflow-hidden"
        whileHover={{
          scale: 1.02,
          y: -10,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
  onClick={() => onSelect({ id: motivation.id, title: motivation.title })}
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={motivation.image || "/placeholder.svg"} 
            alt="" 
            className="w-full h-full object-cover rounded-3xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${motivation.color} opacity-20 rounded-3xl`}
          animate={{ opacity: isHovered ? 0.3 : 0.2 }}
          transition={{ duration: 0.3 }}
        />

        {/* Animated DNA strand overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id={`cardGradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.6)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 50 Q50 25 100 50 Q150 75 200 50 Q250 25 300 50"
              stroke={`url(#cardGradient${index})`}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isHovered ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className={`w-20 h-20 bg-gradient-to-br ${motivation.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
          >
            <IconComponent className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl font-bold text-white mb-4 text-center leading-tight font-orbitron tracking-wide"
            animate={{ color: isHovered ? "#06b6d4" : "#ffffff" }}
          >
            {motivation.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-white/80 text-center leading-relaxed mb-6"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            {motivation.description}
          </motion.p>

          {/* Action Indicator */}
          <motion.div
            className="flex items-center justify-center space-x-2 text-cyan-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-medium font-orbitron tracking-wide">Choose this path</span>
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Floating Particles */}
        {isHovered && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -30, -60],
                  x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))}
          </>
        )}

        {/* Selection ripple effect */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400 rounded-3xl pointer-events-none"
          initial={{ scale: 1, opacity: 0 }}
          animate={isHovered ? { scale: 1.05, opacity: 0.5 } : { scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function MotivationSelection({ onSelect }: MotivationSelectionProps) {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const lastCardRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({ target: containerRef })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200])

  const handleSelect = (motivation: { id: number; title: string }) => {
    onSelect(motivation)
  }

  // Fetch motivations from API
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Array<{ id: number; title: string; description: string }>>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const raw = await getMotivations()
        const mapped = (raw || []).map((m: any) => ({
          id: m.id,
          title: m.title ?? '',
          description: m.description ?? '',
        }))
        if (alive) setItems(mapped)
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load motivations')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // Decorate with visuals
  const decorated = useMemo(() => {
    return items.map((m, i) => ({
      ...m,
      icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length],
      color: DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length],
      image: "/placeholder.svg?height=200&width=300",
    }))
  }, [items])

  // Prevent scrolling past the last motivation card
  useEffect(() => {
    const container = containerRef.current as HTMLDivElement | null
    const last = lastCardRef.current
    if (!container) return

    container.style.overscrollBehavior = 'contain'

    let maxScrollTop = 0
    const computeMax = () => {
      const l = lastCardRef.current
      if (!l) { maxScrollTop = 0; return }
      // Allow a small cushion below the last card (16px)
      const cushion = 16
      const candidate = l.offsetTop + l.offsetHeight - container.clientHeight + cushion
      maxScrollTop = Math.max(0, candidate)
    }

    const onScroll = () => {
      if (container.scrollTop > maxScrollTop) {
        container.scrollTop = maxScrollTop
      }
    }

    computeMax()
    container.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', computeMax)

    return () => {
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', computeMax)
    }
  }, [decorated.length])

  return (
    <div
      ref={containerRef}
      className="min-h-screen max-h-screen relative overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, rgb(124 58 237), rgb(147 51 234), rgb(124 58 237))",
      }}
    >
      {/* Background layer (fixed so it doesn't create extra scroll height) */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          y: backgroundY,
          // Consistent lighter purple gradient across entire screen
          background: "linear-gradient(135deg, rgb(124 58 237), rgb(147 51 234), rgb(124 58 237))",
        }}
      >
        {/* Floating DNA Particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 150}%`, // Extend particles further down
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Large DNA helix background */}
        <svg width="100%" height="300%" className="absolute inset-0 opacity-10">
          <defs>
            <linearGradient id="bgHelix" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <motion.path
            d="M100 0 Q200 100 100 200 Q0 300 100 400 Q200 500 100 600 Q0 700 100 800 Q200 900 100 1000 Q0 1100 100 1200 Q200 1300 100 1400 Q0 1500 100 1600 Q200 1700 100 1800 Q0 1900 100 2000"
            stroke="url(#bgHelix)"
            strokeWidth="4"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            transformOrigin="100 1000"
          />
        </svg>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="pt-20 pb-16 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-orbitron tracking-wide"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          >
            What excites you?
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 max-w-2xl mx-auto px-4 font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Choose your path to unlock your biological potential
          </motion.p>
        </motion.div>

        {/* Motivation Cards */}
        <div className="max-w-4xl mx-auto px-8">
          <div className="space-y-20">
            {loading && (
              <div className="grid gap-8 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full max-w-md mx-auto">
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                      <Skeleton className="absolute inset-0 rounded-3xl opacity-20" />
                      <div className="relative z-10">
                        <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-2xl" />
                        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
                        <Skeleton className="h-4 w-11/12 mx-auto mb-2" />
                        <Skeleton className="h-4 w-2/3 mx-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && !loading && (
              <div className="text-center text-red-300 py-10">{error}</div>
            )}
            {!loading && !error && decorated.length === 0 && (
              <div className="text-center text-white/70 py-10">No motivations found.</div>
            )}
            {!loading && !error && decorated.map((motivation, index) => {
              const isLast = index === decorated.length - 1
              return (
                <div key={motivation.id} ref={isLast ? lastCardRef : null}>
                  <MotivationCard motivation={motivation} index={index} onSelect={handleSelect} />
                </div>
              )
            })}
          </div>
        </div>

  {/* No extra bottom spacing so the view ends cleanly at the last card */}
  </div>
    </div>
  )
}
