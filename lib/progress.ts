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

    // Calculate streak (consecutive days with entries)
    const sortedEntries = entries.sort((a: ProgressEntry, b: ProgressEntry) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

  // Note: This method is deprecated since we now need biohackId for API calls
  static async getAllBiohackProgress(userId: number): Promise<BiohackProgress[]> {
    // This would require a new API endpoint to get all journal entries for a user
    // For now, we'll return an empty array
    console.warn('getAllBiohackProgress is not implemented with the new API structure')
    return []
  }
}
