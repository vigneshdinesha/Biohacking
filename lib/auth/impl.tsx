"use client"

import type React from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { updateUser } from '@/lib/admin'

// Public user shape (extend here when backend adds real auth fields)
export interface User {
	id: string // This is the external/Google ID
	dbId?: number // This is the database user ID
	email: string
	name: string
	picture: string
	motivationId?: number | null
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
	setMotivationId: (id: number | null) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
	return ctx
}

function InnerAuthProvider({ children }: { children: React.ReactNode }) {
	const [sessionUser, setSessionUser] = useState<{ id: string; email: string; name: string; picture?: string; dbId?: number } | null>(null)
	const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
	const [motivationId, setMotivationIdState] = useState<number | null>(null)

	// hydrate motivation from localStorage
	useEffect(() => {
		if (typeof window === 'undefined') return
		const v = localStorage.getItem('biohack_motivation_id')
		if (v) setMotivationIdState(Number(v))
	}, [])

	// fetch session user from cookie via API
	useEffect(() => {
		let alive = true
		;(async () => {
			try {
				setStatus('loading')
				const res = await fetch('/api/session', { cache: 'no-store' })
				const data = await res.json()
				if (!alive) return
				if (data?.user) {
					setSessionUser({ 
						id: data.user.id, 
						email: data.user.email, 
						name: data.user.name, 
						picture: data.user.picture,
						dbId: data.user.dbId 
					})
					// Set motivation ID from JWT if available
					if (data.user.motivationId) {
						setMotivationIdState(data.user.motivationId)
					}
					setStatus('authenticated')
				} else {
					setSessionUser(null)
					setStatus('unauthenticated')
				}
			} catch {
				if (!alive) return
				setSessionUser(null)
				setStatus('unauthenticated')
			}
		})()
		return () => { alive = false }
	}, [])

	const user: User | null = useMemo(() => {
		if (!sessionUser) return null
		return {
			id: sessionUser.id,
			dbId: sessionUser.dbId,
			email: sessionUser.email || '',
			name: sessionUser.name || '',
			picture: sessionUser.picture || '/placeholder.svg?height=40&width=40',
			motivationId,
		}
	}, [sessionUser, motivationId])

	const setMotivationId = async (id: number | null) => {
		setMotivationIdState(id)
		
		// Update database if user has a dbId using actual API
		if (user?.dbId && id !== null) {
			try {
				await updateUser(user.dbId, {
					motivationId: id
				})
				console.log('Updated user motivation in database:', { userId: user.dbId, motivationId: id })
			} catch (error) {
				console.error('Failed to update user motivation in database:', error)
			}
		}
	}

	const login = async () => {
		window.location.assign('/api/oauth/google/start')
	}

	const logout = () => {
	if (typeof window !== 'undefined') {
			localStorage.removeItem('biohack_motivation_id')
			localStorage.removeItem('biohack_progress')
			localStorage.removeItem('biohack_preferences')
	}
		fetch('/api/logout', { method: 'POST' }).finally(() => {
			window.location.assign('/')
		})
	}

	// persist motivation id
	useEffect(() => {
		if (typeof window === 'undefined') return
		if (motivationId == null) return
		localStorage.setItem('biohack_motivation_id', String(motivationId))
	}, [motivationId])

	return (
		<AuthContext.Provider value={{ user, login, logout, loading: status === 'loading', setMotivationId }}>
			{children}
		</AuthContext.Provider>
	)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	return <InnerAuthProvider>{children}</InnerAuthProvider>
}
