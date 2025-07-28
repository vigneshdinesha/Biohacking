"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, Plus } from "lucide-react"
import type { Motivation } from "@/lib/admin"
import { biohackData } from "@/data/biohacks"

interface MotivationFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (motivation: Motivation) => void
  motivation?: Motivation | null
}

export default function MotivationForm({ isOpen, onClose, onSave, motivation }: MotivationFormProps) {
  const [formData, setFormData] = useState<Partial<Motivation>>({
    title: "",
    description: "",
    category: "energy",
    mappedBiohacks: [],
  })

  useEffect(() => {
    if (motivation) {
      setFormData(motivation)
    } else {
      setFormData({
        title: "",
        description: "",
        category: "energy",
        mappedBiohacks: [],
      })
    }
  }, [motivation])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const motivationData: Motivation = {
      id: motivation?.id || `mot_${Date.now()}`,
      title: formData.title || "",
      description: formData.description || "",
      category: formData.category || "energy",
      mappedBiohacks: formData.mappedBiohacks || [],
      createdAt: motivation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(motivationData)
    onClose()
  }

  const availableBiohacks = Object.keys(biohackData)

  const toggleBiohack = (biohackTitle: string) => {
    const current = formData.mappedBiohacks || []
    const updated = current.includes(biohackTitle)
      ? current.filter((b) => b !== biohackTitle)
      : [...current, biohackTitle]

    setFormData({ ...formData, mappedBiohacks: updated })
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center mb-6">
            <Plus className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">{motivation ? "Edit Motivation" : "Create Motivation"}</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                placeholder="e.g., Increase Daily Energy"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-20"
                placeholder="Describe what this motivation helps users achieve..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
              >
                <option value="energy">Energy</option>
                <option value="focus">Focus</option>
                <option value="sleep">Sleep</option>
                <option value="stress">Stress</option>
                <option value="performance">Performance</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>

            {/* Mapped Biohacks */}
            <div>
              <label className="block text-white font-medium mb-2">
                Mapped Biohacks ({formData.mappedBiohacks?.length || 0} selected)
              </label>
              <div className="bg-white/5 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {availableBiohacks.map((biohackTitle) => (
                    <label key={biohackTitle} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mappedBiohacks?.includes(biohackTitle) || false}
                        onChange={() => toggleBiohack(biohackTitle)}
                        className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-white/90 text-sm">{biohackTitle}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Motivation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
