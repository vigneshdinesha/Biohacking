"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  picture: string
  preferences?: {
    selectedBiohacks: string[]
    goals: string[]
    experience: string
  }
}

interface AuthContextType {
  user: User | null
  login: () => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement | null {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("biohack_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async () => {
    // Simulate Google OAuth login
    const mockUser: User = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email: "user@example.com",
      name: "John Doe",
      picture: "/placeholder.svg?height=40&width=40",
    }

    setUser(mockUser)
    localStorage.setItem("biohack_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("biohack_user")
    localStorage.removeItem("biohack_progress")
    localStorage.removeItem("biohack_preferences")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
