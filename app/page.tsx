"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { User, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import BiohackModal from "@/components/biohack-modal"
import AuthModal from "@/components/auth-modal"
import IntroSequence from "@/components/intro-sequence"
import MotivationSelection from "@/components/motivation-selection"
import { AuthProvider, useAuth } from "@/lib/auth"
import { getMotivation } from "@/lib/admin"

const SceneWrapper = dynamic(() => import("@/components/scene-wrapper"), { ssr: false })

function HomeContent() {
  const [currentView, setCurrentView] = useState<"intro" | "motivation" | "main">("intro")
  const [activeTab, setActiveTab] = useState<"lifestyle" | "feel-good">("lifestyle")
  const [selectedBiohack, setSelectedBiohack] = useState<{ id: number; title: string } | null>(null)
  const [selectedMotivation, setSelectedMotivation] = useState<{ id: number; title: string } | null>(null)
  const { user, logout, loading, setMotivationId } = useAuth()
  const [authPrompt, setAuthPrompt] = useState(false)

  // Gate: prompt auth before intro when user is not signed in
  useEffect(() => {
    if (loading) return
    if (!user) {
      setAuthPrompt(true)
    } else {
      setAuthPrompt(false)
      // If signed in and a motivation is already linked, skip intro and selection
      if (user.motivationId) {
        ;(async () => {
          try {
            const m = await getMotivation(user.motivationId!)
            setSelectedMotivation({ id: user.motivationId!, title: m?.title ?? '' })
          } catch {
            setSelectedMotivation({ id: user.motivationId!, title: '' })
          } finally {
            setCurrentView("main")
          }
        })()
      }
    }
  }, [user, loading])

  const handleIntroComplete = () => {
    setCurrentView("motivation")
  }

  const handleMotivationSelect = (motivation: { id: number; title: string }) => {
    setSelectedMotivation(motivation)
  // persist in auth/local state
  setMotivationId(motivation.id)
    setCurrentView("main")
  }

  const handleBubbleClick = (biohack: { id: number; title: string }) => {
    setSelectedBiohack(biohack)
  }

  const handleCloseModal = () => {
    setSelectedBiohack(null)
  }

  const handleChangeMotivation = () => {
    // Clear selected motivation locally and in auth/localStorage, then show selector
    setSelectedMotivation(null)
    setMotivationId(null)
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem('biohack_motivation_id') } catch {}
    }
    setCurrentView("motivation")
  }

  // Show auth modal if not signed in (non-closable until sign-in)
  if (authPrompt) {
    return <AuthModal isOpen closable={false} onClose={() => {}} />
  }

  // Show intro sequence first when signed in and no existing motivation
  if (currentView === "intro") {
    return <IntroSequence onComplete={handleIntroComplete} />
  }

  // Show motivation selection
  if (currentView === "motivation") {
    return <MotivationSelection onSelect={handleMotivationSelect} />
  }

  // Main app view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* DNA Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="dna" x="0" y="0" width="100" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M20 0 Q50 50 80 100 Q50 150 20 200 M80 0 Q50 50 20 100 Q50 150 80 200"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M20 0 Q50 50 80 100 Q50 150 20 200 M80 0 Q50 50 20 100 Q50 150 80 200"
                stroke="#06b6d4"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
                transform="translate(100, 0)"
              />
              <g stroke="#8b5cf6" strokeWidth="1" opacity="0.3">
                <line x1="20" y1="25" x2="80" y2="25" />
                <line x1="35" y1="50" x2="65" y2="50" />
                <line x1="20" y1="75" x2="80" y2="75" />
                <line x1="35" y1="100" x2="65" y2="100" />
                <line x1="20" y1="125" x2="80" y2="125" />
                <line x1="35" y1="150" x2="65" y2="150" />
                <line x1="20" y1="175" x2="80" y2="175" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dna)" />
        </svg>
      </div>

      {/* Header - Top Left */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Biohacking</h1>

        {/* Show selected motivation */}
    {selectedMotivation && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-4 border border-white/20 max-w-xs">
            <p className="text-white/80 text-sm">Your focus:</p>
      <p className="text-cyan-400 font-medium text-sm">{selectedMotivation.title}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
          <button
            onClick={() => setActiveTab("lifestyle")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
              activeTab === "lifestyle" ? "bg-white text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            Lifestyle
          </button>
          <button
            onClick={() => setActiveTab("feel-good")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
              activeTab === "feel-good" ? "bg-white text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            Feel Good
          </button>
        </div>
      </div>

      {/* User Menu - Top Right */}
      <div className="absolute top-8 right-8 z-10">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center space-x-3">
              <img src={user.picture || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
              <div className="text-white">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-white/70">{user.email}</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Settings menu"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg p-2 border border-white/20 transition-colors"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleChangeMotivation}>
                  Change motivation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 max-w-xs">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-lg font-bold text-white">Welcome!</h2>
            </div>
            <p className="text-white/80 text-sm mb-3">
              Sign in to track progress and personalize your biohacking journey
            </p>
          </div>
        )}
      </div>

      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
  <SceneWrapper activeTab={activeTab} motivationId={selectedMotivation?.id ?? null} onBubbleClick={handleBubbleClick} />
      </div>

      {/* Biohack Modal */}
  <BiohackModal isOpen={!!selectedBiohack} onClose={handleCloseModal} biohackId={selectedBiohack?.id ?? null} biohackTitle={selectedBiohack?.title ?? ""} />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
