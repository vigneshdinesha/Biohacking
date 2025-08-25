"use client"

import { useState, useEffect } from "react"
import { X, Star, Calendar, BookOpen, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ProgressManager, type ProgressEntry, type BiohackProgress } from "@/lib/progress"

interface ProgressModalProps {
  isOpen: boolean
  onClose: () => void
  biohackTitle: string
  biohackId: number
}

export default function ProgressModal({ isOpen, onClose, biohackTitle, biohackId }: ProgressModalProps) {
  const { user } = useAuth()
  const [notes, setNotes] = useState("")
  const [rating, setRating] = useState(5)
  const [showHistory, setShowHistory] = useState(false)
  const [biohackProgress, setBiohackProgress] = useState<BiohackProgress>({
    biohackTitle,
    entries: [],
    totalSessions: 0,
    averageRating: 0,
    streak: 0,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load progress data when modal opens
  useEffect(() => {
    if (!isOpen || !user || !user.dbId || !biohackId) return
    
    const loadProgress = async () => {
      setLoading(true)
      setError(null)
      try {
        const progress = await ProgressManager.getBiohackProgress(user.dbId!, biohackId, biohackTitle)
        setBiohackProgress(progress)
      } catch (err) {
        console.error('Failed to load progress:', err)
        setError('Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [isOpen, user, biohackId, biohackTitle])

  if (!isOpen || !user || !user.dbId) return null

  const handleSaveProgress = async () => {
    if (!user.dbId) return
    
    setSaving(true)
    setError(null)
    
    try {
      const entry: Omit<ProgressEntry, 'id'> = {
        biohackTitle,
        biohackId,
        date: new Date().toISOString(),
        notes,
        rating,
        completed: true,
      }

      await ProgressManager.saveProgress(user.dbId, biohackId, entry)
      
      // Reload progress data
      const updatedProgress = await ProgressManager.getBiohackProgress(user.dbId, biohackId, biohackTitle)
      setBiohackProgress(updatedProgress)
      
      // Reset form
      setNotes("")
      setRating(5)
      
      // Don't close modal, just switch to history view to show the new entry
      setShowHistory(true)
    } catch (err) {
      console.error('Failed to save progress:', err)
      setError('Failed to save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900/95 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Track Progress</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-white/70 mt-2">Loading progress...</p>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{biohackProgress.totalSessions}</div>
              <div className="text-sm text-white/70">Sessions</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{biohackProgress.averageRating.toFixed(1)}</div>
              <div className="text-sm text-white/70">Avg Rating</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{biohackProgress.streak}</div>
              <div className="text-sm text-white/70">Day Streak</div>
            </div>
          </div>

          {/* Toggle between Add Entry and History */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setShowHistory(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showHistory ? "bg-blue-500 text-white" : "bg-white/10 text-white/70"
              }`}
            >
              Add Entry
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showHistory ? "bg-blue-500 text-white" : "bg-white/10 text-white/70"
              }`}
            >
              History ({biohackProgress.entries.length})
            </button>
          </div>

          {!showHistory ? (
            /* Add New Entry */
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">How did it go?</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${star <= rating ? "text-yellow-400" : "text-white/30"}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did you feel? What worked well? Any observations..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-24"
                />
              </div>

              <button
                onClick={handleSaveProgress}
                disabled={saving}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Progress'
                )}
              </button>
            </div>
          ) : (
            /* History View */
            <div className="space-y-4">
              {biohackProgress.entries.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No progress entries yet. Start tracking to see your journey!</p>
                </div>
              ) : (
                biohackProgress.entries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div key={entry.id} className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-white/70 text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= entry.rating ? "text-yellow-400 fill-current" : "text-white/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {entry.notes && <p className="text-white/90 text-sm">{entry.notes}</p>}
                    </div>
                  ))
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
