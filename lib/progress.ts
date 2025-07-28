"use client"

export interface ProgressEntry {
  id: string
  biohackTitle: string
  date: string
  notes: string
  rating: number // 1-5 stars
  completed: boolean
}

export interface BiohackProgress {
  biohackTitle: string
  entries: ProgressEntry[]
  totalSessions: number
  averageRating: number
  streak: number
}

export class ProgressManager {
  private static getStorageKey(userId: string) {
    return `biohack_progress_${userId}`
  }

  static saveProgress(userId: string, entry: ProgressEntry) {
    const key = this.getStorageKey(userId)
    const existing = JSON.parse(localStorage.getItem(key) || "[]")
    existing.push(entry)
    localStorage.setItem(key, JSON.stringify(existing))
  }

  static getProgress(userId: string): ProgressEntry[] {
    const key = this.getStorageKey(userId)
    return JSON.parse(localStorage.getItem(key) || "[]")
  }

  static getBiohackProgress(userId: string, biohackTitle: string): BiohackProgress {
    const allProgress = this.getProgress(userId)
    const entries = allProgress.filter((entry) => entry.biohackTitle === biohackTitle)

    const totalSessions = entries.length
    const averageRating =
      entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length : 0

    // Calculate streak (consecutive days with entries)
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0
    let currentDate = new Date()

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= streak + 1) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return {
      biohackTitle,
      entries,
      totalSessions,
      averageRating,
      streak,
    }
  }

  static getAllBiohackProgress(userId: string): BiohackProgress[] {
    const allProgress = this.getProgress(userId)
    const biohackTitles = [...new Set(allProgress.map((entry) => entry.biohackTitle))]

    return biohackTitles.map((title) => this.getBiohackProgress(userId, title))
  }
}
