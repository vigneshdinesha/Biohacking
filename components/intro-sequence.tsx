"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView, useVelocity, useSpring } from "framer-motion"
import { SkipForward } from "lucide-react"

interface IntroSequenceProps {
  onComplete: () => void
}

const textSegments = [
  { text: "Let's evolve.", size: "large", emphasis: true },
  { text: "You are a dynamic system —", size: "medium" },
  { text: "neurochemical, electrical, hormonal, human.", size: "medium" },
  { text: "You adapt every day.", size: "medium" },
  { text: "Now, do it with precision.", size: "medium", emphasis: true },
  { text: "Biohacking is the science of self-directed change.", size: "large" },
  { text: "It starts with data:", size: "medium" },
  { text: "how you sleep, how you recover, how you think under pressure.", size: "small" },
  { text: "Patterns emerge. Choices sharpen. Progress compounds.", size: "medium" },
  { text: "This is not optimization for its own sake.", size: "medium" },
  { text: "This is about alignment — between biology and purpose.", size: "large", emphasis: true },
  { text: "The goal isn't to fix you.", size: "medium" },
  { text: "The goal is to unlock you.", size: "large", emphasis: true },
  { text: "Because focus is trainable.", size: "medium" },
  { text: "Energy is measurable.", size: "medium" },
  { text: "Resilience is built.", size: "medium" },
  { text: "And evolution?", size: "medium" },
  { text: "It's not something that happens to you.", size: "medium" },
  { text: "It's something you design.", size: "large", emphasis: true },
  { text: "Understand your system.", size: "medium" },
  { text: "Work with it.", size: "medium" },
  { text: "Welcome to the experiment of you.", size: "large", emphasis: true },
]

function DNAHelix({ scrollY, index }: { scrollY: any; index: number }) {
  const helixY = useTransform(scrollY, [0, 1], [0, -2000 - index * 500])
  const helixRotation = useTransform(scrollY, [0, 1], [0, 720 + index * 180])
  const helixOpacity = useTransform(scrollY, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      className="absolute left-0 w-full h-full pointer-events-none"
      style={{
        y: helixY,
        opacity: helixOpacity,
      }}
    >
      <svg
        width="100%"
        height="2000"
        className="absolute"
        style={{
          left: `${10 + index * 15}%`,
          transform: `rotate(${index * 45}deg)`,
        }}
      >
        <defs>
          <linearGradient id={`helixGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${180 + index * 30}, 80%, 60%)`} stopOpacity="0" />
            <stop offset="20%" stopColor={`hsl(${180 + index * 30}, 80%, 60%)`} stopOpacity="0.8" />
            <stop offset="80%" stopColor={`hsl(${200 + index * 30}, 80%, 60%)`} stopOpacity="0.8" />
            <stop offset="100%" stopColor={`hsl(${200 + index * 30}, 80%, 60%)`} stopOpacity="0" />
          </linearGradient>
          <filter id={`helixGlow${index}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g style={{ rotate: helixRotation }} transformOrigin="50% 50%">
          {/* Left strand */}
          <path
            d="M200 0 Q300 100 200 200 Q100 300 200 400 Q300 500 200 600 Q100 700 200 800 Q300 900 200 1000 Q100 1100 200 1200 Q300 1300 200 1400 Q100 1500 200 1600 Q300 1700 200 1800 Q100 1900 200 2000"
            stroke={`url(#helixGradient${index})`}
            strokeWidth="3"
            fill="none"
            filter={`url(#helixGlow${index})`}
          />

          {/* Right strand */}
          <path
            d="M400 0 Q300 100 400 200 Q500 300 400 400 Q300 500 400 600 Q500 700 400 800 Q300 900 400 1000 Q500 1100 400 1200 Q300 1300 400 1400 Q500 1500 400 1600 Q300 1700 400 1800 Q500 1900 400 2000"
            stroke={`url(#helixGradient${index})`}
            strokeWidth="3"
            fill="none"
            filter={`url(#helixGlow${index})`}
          />

          {/* Connecting base pairs */}
          {[...Array(20)].map((_, i) => (
            <motion.line
              key={i}
              x1={200 + Math.sin(i * 0.314) * 100}
              y1={i * 100}
              x2={400 - Math.sin(i * 0.314) * 100}
              y2={i * 100}
              stroke={`hsl(${160 + index * 20 + i * 5}, 70%, 70%)`}
              strokeWidth="2"
              opacity="0.6"
              filter={`url(#helixGlow${index})`}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </motion.g>
      </svg>
    </motion.div>
  )
}

function TextSegment({ segment, index, scrollVelocity }: { segment: any; index: number; scrollVelocity: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  const sizeClasses: Record<string, string> = {
    small: "text-lg md:text-xl",
    medium: "text-2xl md:text-3xl",
    large: "text-4xl md:text-5xl lg:text-6xl",
  }

  // Velocity-based effects
  const velocityScale = useTransform(scrollVelocity, [-1000, 0, 1000], [0.8, 1, 1.2])
  const velocityBlur = useTransform(scrollVelocity, [-1000, 0, 1000], [5, 0, 5])

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center px-8 snap-center"
      initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      style={{
        scale: velocityScale,
        filter: `blur(${velocityBlur}px)`,
      }}
    >
      <motion.p
        className={`
          ${sizeClasses[segment.size]} 
          ${segment.emphasis ? "font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text text-transparent" : "font-light text-white"}
          text-center leading-relaxed max-w-4xl
        `}
        animate={
          isInView && segment.emphasis
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : {}
        }
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        style={segment.emphasis ? { backgroundSize: "200% 200%" } : {}}
      >
        {segment.text}
      </motion.p>

      {/* Floating molecular structures */}
      {segment.emphasis && isInView && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 4,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="3" fill="rgba(6, 182, 212, 0.8)" />
                <circle cx="10" cy="15" r="2" fill="rgba(16, 185, 129, 0.6)" />
                <circle cx="30" cy="25" r="2" fill="rgba(139, 92, 246, 0.6)" />
                <line x1="20" y1="20" x2="10" y2="15" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
                <line x1="20" y1="20" x2="30" y2="25" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const containerRef = useRef(null)
  const { scrollY, scrollYProgress } = useScroll({ container: containerRef })
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })

  const [showContinue, setShowContinue] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const velocityParticles = useRef(null)

  // Show skip button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Show continue button when user has scrolled through most content
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      if (progress > 0.8) {
        setShowContinue(true)
      }
    })
    return unsubscribe
  }, [scrollYProgress])

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Skip Button - Subtle */}
      <motion.button
        onClick={onComplete}
        className="fixed top-6 right-6 z-50 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-full p-3 text-white/60 hover:text-white/90 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showSkip ? 1 : 0, scale: showSkip ? 1 : 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SkipForward className="w-4 h-4" />
      </motion.button>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <radialGradient id="spotlight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 0.1)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.9)" />
            </radialGradient>
          </defs>

          {/* Dynamic spotlight that follows scroll */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="60%"
            fill="url(#spotlight)"
            style={{
              scale: useTransform(scrollYProgress, [0, 1], [0.5, 1.2]),
              opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]),
            }}
          />
        </svg>
      </div>

      {/* Gliding DNA Helixes */}
      {[...Array(5)].map((_, i) => (
        <DNAHelix key={i} scrollY={scrollYProgress} index={i} />
      ))}

      {/* Velocity-responsive particles */}
      <div ref={velocityParticles} className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Scrollable Content with Snap */}
      <div
        ref={containerRef}
        className="relative z-10 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Initial Brand Section */}
        <motion.div
          className="min-h-screen flex items-center justify-center snap-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.h1
              className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text text-transparent mb-8"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              style={{ backgroundSize: "200% 200%" }}
            >
              BIOHACKING
            </motion.h1>

            {/* Animated DNA icon */}
            <motion.div
              className="mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                <defs>
                  <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 10 Q40 30 60 50 Q40 70 20 90 M60 10 Q40 30 20 50 Q40 70 60 90"
                  stroke="url(#dnaGradient)"
                  strokeWidth="3"
                  fill="none"
                />
                {[...Array(8)].map((_, i) => (
                  <line
                    key={i}
                    x1={20 + Math.sin(i * 0.785) * 20}
                    y1={10 + i * 10}
                    x2={60 - Math.sin(i * 0.785) * 20}
                    y2={10 + i * 10}
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </motion.div>

            <motion.div
              className="text-white/60 text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Scroll to explore your evolution
            </motion.div>

            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Segments */}
        {textSegments.map((segment, index) => (
          <TextSegment key={index} segment={segment} index={index} scrollVelocity={smoothVelocity} />
        ))}

        {/* Continue Button */}
        <motion.div
          className="min-h-screen flex items-center justify-center snap-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContinue ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <motion.button
            onClick={onComplete}
            className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-2xl"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.3)",
                "0 0 40px rgba(6, 182, 212, 0.6)",
                "0 0 20px rgba(6, 182, 212, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Begin Your Journey
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-green-400 origin-left z-40"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Velocity indicator */}
      <motion.div
        className="fixed bottom-6 left-6 w-2 h-16 bg-white/10 rounded-full overflow-hidden z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-full bg-gradient-to-t from-cyan-400 to-green-400 rounded-full"
          style={{
            height: useTransform(smoothVelocity, [-1000, 0, 1000], ["0%", "10%", "100%"]),
          }}
        />
      </motion.div>
    </div>
  )
}
