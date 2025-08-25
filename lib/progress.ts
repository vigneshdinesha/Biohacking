"use client"

export interface ProgressEntry {
  id: string
  biohackTitle: string
  biohackId: number
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
  longestStreak: number
}

const API_BASE = 'http://localhost:5189/api'

export class ProgressManager {
  static async saveProgress(userId: number, biohackId: number, entry: Omit<ProgressEntry, 'id'>): Promise<ProgressEntry> {
    const journalData = {
      userId: userId,
      biohackId: biohackId,
      notes: entry.notes,
      rating: entry.rating,
      dateTime: entry.date
    }

    const response = await fetch(`${API_BASE}/Journals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(journalData),
    })

    if (!response.ok) {
      throw new Error(`Failed to save progress: ${response.statusText}`)
    }

    const savedJournal = await response.json()
    
    // Convert API response back to ProgressEntry format
    return {
      id: savedJournal.id.toString(),
      biohackTitle: entry.biohackTitle,
      biohackId: biohackId,
      date: savedJournal.dateTime || entry.date,
      notes: savedJournal.notes,
      rating: savedJournal.rating,
      completed: true
    }
  }

  static async getProgress(userId: number, biohackId: number): Promise<ProgressEntry[]> {
    const response = await fetch(`${API_BASE}/Journals/user/${userId}/biohack/${biohackId}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return [] // No entries found
      }
      throw new Error(`Failed to fetch progress: ${response.statusText}`)
    }

    const journals = await response.json()
    
    // Convert API response to ProgressEntry format
    return journals.map((journal: any) => ({
      id: journal.id.toString(),
      biohackTitle: journal.biohackName || '', // Assuming API returns biohack name
      biohackId: journal.biohackId,
      date: journal.dateTime,
      notes: journal.notes,
      rating: journal.rating,
      completed: true
    }))
  }

  static async getBiohackProgress(userId: number, biohackId: number, biohackTitle: string): Promise<BiohackProgress> {
    const entries = await this.getProgress(userId, biohackId)

    const totalSessions = entries.length
    const averageRating =
      entries.length > 0 ? entries.reduce((sum: number, entry: ProgressEntry) => sum + entry.rating, 0) / entries.length : 0

    // Get unique days with entries (multiple entries on same day count as one day)
    const uniqueDays = [...new Set(entries.map(entry => {
      const date = new Date(entry.date)
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }))].sort()

    // Calculate current streak (consecutive days ending today or yesterday)
    let currentStreak = 0
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
    
    // Check if there's an entry today
    let hasEntryToday = uniqueDays.includes(todayStr)
    
    // Start checking from today or yesterday
    let checkDate = new Date(today)
    if (!hasEntryToday) {
      // If no entry today, start from yesterday
      checkDate.setDate(checkDate.getDate() - 1)
    }
    
    // Count consecutive days backwards
    while (true) {
      const checkDateStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`
      if (uniqueDays.includes(checkDateStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    // Calculate longest streak ever
    let longestStreak = 0
    let tempStreak = 0
    
    if (uniqueDays.length > 0) {
      // Convert unique days to Date objects and sort chronologically
      const sortedDates = uniqueDays.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(year, month, day)
      }).sort((a, b) => a.getTime() - b.getTime())
      
      tempStreak = 1
      longestStreak = 1
      
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i - 1]
        const currentDate = sortedDates[i]
        const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          // Consecutive day
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          // Gap in days, reset temp streak
          tempStreak = 1
        }
      }
    }

    return {
      biohackTitle,
      entries,
      totalSessions,
      averageRating,
      streak: currentStreak,
      longestStreak,
    }
  }

  // Note: This method is deprecated since we now need biohackId for API calls
  static async getAllBiohackProgress(userId: number): Promise<BiohackProgress[]> {
    // This would require a new API endpoint to get all journal entries for a user
    // For now, we'll return an empty array
    console.warn('getAllBiohackProgress is not implemented with the new API structure')
    return []
  }
}
