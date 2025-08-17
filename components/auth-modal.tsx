"use client"

import { useState } from "react"
import { X, User } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  closable?: boolean
}

export default function AuthModal({ isOpen, onClose, closable = true }: AuthModalProps) {
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closable ? onClose : undefined} />

      <div className="relative bg-slate-900/95 backdrop-blur-md rounded-2xl max-w-md w-full p-8 border border-white/20">
        {closable && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

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
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.648,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12   s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.084,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20   s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657   C33.64,6.053,29.084,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.136,0,9.748-1.969,13.292-5.182l-6.152-5.207C29.177,35.091,26.715,36,24,36   c-5.202,0-9.619-3.317-11.283-7.946l-6.536,5.036C9.49,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.118,5.611   c0.001-0.001,0.002-0.001,0.003-0.002l6.152,5.207C36.943,39.237,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </span>
        </button>

        <p className="text-xs text-white/50 text-center mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
