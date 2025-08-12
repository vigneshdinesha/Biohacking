"use client"

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

// Public user shape (extend here when backend adds real auth fields)
export interface User {
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
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
	return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// On mount, hydrate from localStorage (simple mock persistence)
	useEffect(() => {
		try {
			const saved = typeof window !== 'undefined' ? localStorage.getItem('biohack_user') : null
			if (saved) setUser(JSON.parse(saved))
		} catch (e) {
			console.warn('Failed to parse saved user', e)
		} finally {
			setLoading(false)
		}
	}, [])

	const login = async () => {
		// Mock login (replace with real OAuth / backend later)
		const mockUser: User = {
			id: 'user_' + Math.random().toString(36).slice(2, 11),
			email: 'user@example.com',
			name: 'John Doe',
			picture: '/placeholder.svg?height=40&width=40'
		}
		setUser(mockUser)
		if (typeof window !== 'undefined') localStorage.setItem('biohack_user', JSON.stringify(mockUser))
	}

	const logout = () => {
		setUser(null)
		if (typeof window !== 'undefined') {
			localStorage.removeItem('biohack_user')
			localStorage.removeItem('biohack_progress')
			localStorage.removeItem('biohack_preferences')
		}
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	)
}
