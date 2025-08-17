"use client"

import { useEffect, useMemo, useState } from "react"
import { X, Target, Brain, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"
import AuthModal from "./auth-modal"
import ProgressModal from "./progress-modal"
import ReminderModal from "./reminder-modal"
import { getBiohack } from "@/lib/admin"

interface BiohackModalProps {
  isOpen: boolean
  onClose: () => void
  biohackId: number | null
  biohackTitle: string
}

export default function BiohackModal({ isOpen, onClose, biohackId, biohackTitle }: BiohackModalProps) {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [biohack, setBiohack] = useState<any | null>(null)

  // Load live biohack data by id when available; otherwise keep minimal UI with title
  useEffect(() => {
    if (!isOpen || !biohackId) return
    let alive = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await getBiohack(biohackId)
        if (alive) setBiohack(data)
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load biohack')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [biohackId, isOpen])

  const IconComponent = Clock // Placeholder icon for header; specific icons not in API

  const handleTrackProgress = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setShowProgressModal(true)
  }

  const handleSetReminder = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setShowReminderModal(true)
  }

  // Parse research studies which may be a JSON string or array
  const studies = useMemo(() => {
    const raw = biohack?.researchStudies
    if (!raw) return [] as Array<{ summary: string; sourceURL?: string }>
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          if (typeof item === 'string') return { summary: item }
          if (item && typeof item === 'object') return { summary: String(item.summary ?? ''), sourceURL: item.sourceURL }
          return { summary: String(item) }
        })
      }
      // Object form
      if (parsed && typeof parsed === 'object') {
        const { summary, sourceURL } = parsed as any
        return [{ summary: String(summary ?? ''), sourceURL }]
      }
      return []
    } catch {
      // Not JSON, treat as plain text
      return [{ summary: String(raw) }]
    }
  }, [biohack?.researchStudies])

  return (
    <>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-slate-900/95 backdrop-blur-md rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <div className="relative p-8">
            {/* Hero Section */}
            <div className={`bg-gradient-to-r from-cyan-500/40 to-green-500/40 rounded-2xl p-6 mb-6 text-white`}>
              <div className="flex items-center mb-3">
                <IconComponent className="w-8 h-8 mr-4" />
                <h1 className="text-3xl md:text-4xl font-bold">{biohack?.title || biohackTitle}</h1>
              </div>
              <p className="text-lg opacity-90">Transform your biology with this science-backed technique</p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Technique Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-green-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">The Technique</h2>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 mb-4">
                  <h3 className="text-lg font-semibold text-green-300 mb-1">{biohack?.technique || biohackTitle}</h3>
                </div>
                <div className="space-y-3">
                  {(biohack?.action || []).map((step: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-white/90 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Science Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <Brain className="w-6 h-6 text-purple-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">The Science</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <h3 className="text-base font-semibold text-purple-300 mb-2">Mechanism</h3>
                    <p className="text-white/90 text-sm">{biohack?.mechanism || '—'}</p>
                  </div>

                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <h3 className="text-base font-semibold text-blue-300 mb-2">Research</h3>
                    {studies.length === 0 ? (
                      <p className="text-white/90 text-sm">—</p>
                    ) : (
                      <ul className="space-y-2">
                        {studies.map((s, i) => (
                          <li key={i} className="text-white/90 text-sm">
                            {s.sourceURL ? (
                              <a href={s.sourceURL} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">
                                {s.summary || s.sourceURL}
                              </a>
                            ) : (
                              <span>{s.summary}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-orange-500/20 rounded-lg p-3">
                    <h3 className="text-base font-semibold text-orange-300 mb-2">Biology</h3>
                    <p className="text-white/90 text-sm">{biohack?.biology || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-6">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-white/20 text-center">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Ready to Start?</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Consistency is key. Start with just 5 minutes today and build up gradually.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleSetReminder}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-colors text-sm"
                  >
                    Set Reminder
                  </button>
                  <button
                    onClick={handleTrackProgress}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-semibold transition-colors text-sm"
                  >
                    Track Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  </div>
  )}

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        biohackTitle={biohackTitle}
      />
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        biohackTitle={biohackTitle}
      />
    </>
  )
}
