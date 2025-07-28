"use client"

export interface Motivation {
  id: string
  title: string
  description: string
  category: "energy" | "focus" | "sleep" | "stress" | "performance" | "wellness"
  mappedBiohacks: string[] // Array of biohack titles
  createdAt: string
  updatedAt: string
}

export interface AdminBiohack {
  id: string
  title: string
  technique: string
  category: "lifestyle" | "feel-good"
  difficulty: "beginner" | "intermediate" | "advanced"
  timeRequired: string
  icon: string
  color: string
  action: string[]
  science: {
    mechanism: string
    studies: string
    biology: string
  }
  createdAt: string
  updatedAt: string
}

export class AdminManager {
  // Motivations Management
  static getMotivations(): Motivation[] {
    return JSON.parse(localStorage.getItem("admin_motivations") || "[]")
  }

  static saveMotivation(motivation: Motivation) {
    const motivations = this.getMotivations()
    const existingIndex = motivations.findIndex((m) => m.id === motivation.id)

    if (existingIndex >= 0) {
      motivations[existingIndex] = { ...motivation, updatedAt: new Date().toISOString() }
    } else {
      motivations.push({ ...motivation, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }

    localStorage.setItem("admin_motivations", JSON.stringify(motivations))
  }

  static deleteMotivation(id: string) {
    const motivations = this.getMotivations().filter((m) => m.id !== id)
    localStorage.setItem("admin_motivations", JSON.stringify(motivations))
  }

  // Biohacks Management
  static getAdminBiohacks(): AdminBiohack[] {
    return JSON.parse(localStorage.getItem("admin_biohacks") || "[]")
  }

  static saveAdminBiohack(biohack: AdminBiohack) {
    const biohacks = this.getAdminBiohacks()
    const existingIndex = biohacks.findIndex((b) => b.id === biohack.id)

    if (existingIndex >= 0) {
      biohacks[existingIndex] = { ...biohack, updatedAt: new Date().toISOString() }
    } else {
      biohacks.push({ ...biohack, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }

    localStorage.setItem("admin_biohacks", JSON.stringify(biohacks))
  }

  static deleteAdminBiohack(id: string) {
    const biohacks = this.getAdminBiohacks().filter((b) => b.id !== id)
    localStorage.setItem("admin_biohacks", JSON.stringify(biohacks))
  }

  // Initialize with sample data
  static initializeSampleData() {
    const existingMotivations = this.getMotivations()
    const existingBiohacks = this.getAdminBiohacks()

    if (existingMotivations.length === 0) {
      const sampleMotivations: Motivation[] = [
        {
          id: "mot_1",
          title: "Increase Daily Energy",
          description: "Feel more energized throughout the day without relying on caffeine",
          category: "energy",
          mappedBiohacks: ["Feel more alert for 2 hours", "Increase energy levels"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mot_2",
          title: "Improve Focus & Concentration",
          description: "Enhance mental clarity and sustained attention for work and study",
          category: "focus",
          mappedBiohacks: ["Boost focus naturally", "Improve mental clarity"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mot_3",
          title: "Better Sleep Quality",
          description: "Fall asleep faster and wake up more refreshed",
          category: "sleep",
          mappedBiohacks: ["Optimize sleep cycles"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mot_4",
          title: "Reduce Stress & Anxiety",
          description: "Manage stress naturally and feel more calm and centered",
          category: "stress",
          mappedBiohacks: ["Reduce stress naturally", "Come back to present moment", "Mindful meditation"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem("admin_motivations", JSON.stringify(sampleMotivations))
    }
  }
}
