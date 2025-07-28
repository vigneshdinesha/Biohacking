"use client"

import { useState } from "react"
import { X, User, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleLogin = async () => {
    setLoading(true)
    try {
      await login()
      onClose()
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900/95 backdrop-blur-md rounded-2xl max-w-md w-full p-8 border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="text-center mb-6">
          <User className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Biohacking</h2>
          <p className="text-white/70">Sign in to track your progress and personalize your experience</p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          <Mail className="w-5 h-5" />
          <span>{loading ? "Signing in..." : "Continue with Google"}</span>
        </button>

        <p className="text-xs text-white/50 text-center mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
