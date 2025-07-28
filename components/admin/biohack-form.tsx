"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, Plus, Minus } from "lucide-react"
import type { AdminBiohack } from "@/lib/admin"

interface BiohackFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (biohack: AdminBiohack) => void
  biohack?: AdminBiohack | null
}

export default function BiohackForm({ isOpen, onClose, onSave, biohack }: BiohackFormProps) {
  const [formData, setFormData] = useState<Partial<AdminBiohack>>({
    title: "",
    technique: "",
    category: "lifestyle",
    difficulty: "beginner",
    timeRequired: "",
    icon: "Zap",
    color: "from-blue-400 to-purple-500",
    action: [""],
    science: {
      mechanism: "",
      studies: "",
      biology: "",
    },
  })

  useEffect(() => {
    if (biohack) {
      setFormData(biohack)
    } else {
      setFormData({
        title: "",
        technique: "",
        category: "lifestyle",
        difficulty: "beginner",
        timeRequired: "",
        icon: "Zap",
        color: "from-blue-400 to-purple-500",
        action: [""],
        science: {
          mechanism: "",
          studies: "",
          biology: "",
        },
      })
    }
  }, [biohack])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const biohackData: AdminBiohack = {
      id: biohack?.id || `bio_${Date.now()}`,
      title: formData.title || "",
      technique: formData.technique || "",
      category: formData.category || "lifestyle",
      difficulty: formData.difficulty || "beginner",
      timeRequired: formData.timeRequired || "",
      icon: formData.icon || "Zap",
      color: formData.color || "from-blue-400 to-purple-500",
      action: formData.action?.filter((step) => step.trim()) || [],
      science: formData.science || { mechanism: "", studies: "", biology: "" },
      createdAt: biohack?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(biohackData)
    onClose()
  }

  const addActionStep = () => {
    setFormData({
      ...formData,
      action: [...(formData.action || []), ""],
    })
  }

  const removeActionStep = (index: number) => {
    const newAction = formData.action?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, action: newAction })
  }

  const updateActionStep = (index: number, value: string) => {
    const newAction = [...(formData.action || [])]
    newAction[index] = value
    setFormData({ ...formData, action: newAction })
  }

  const colorOptions = [
    "from-blue-400 to-purple-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-500",
    "from-red-400 to-pink-500",
    "from-purple-400 to-indigo-500",
    "from-cyan-400 to-blue-500",
    "from-orange-400 to-red-500",
    "from-indigo-400 to-purple-600",
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center mb-6">
            <Plus className="w-6 h-6 text-green-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">{biohack ? "Edit Biohack" : "Create Biohack"}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                  placeholder="e.g., Boost focus naturally"
                  required
                />
              </div>

              {/* Technique */}
              <div>
                <label className="block text-white font-medium mb-2">Technique</label>
                <input
                  type="text"
                  value={formData.technique}
                  onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                  placeholder="e.g., Cold Water Face Plunge + Breathing Protocol"
                  required
                />
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    <option value="lifestyle">Lifestyle</option>
                    <option value="feel-good">Feel Good</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Time Required */}
              <div>
                <label className="block text-white font-medium mb-2">Time Required</label>
                <input
                  type="text"
                  value={formData.timeRequired}
                  onChange={(e) => setFormData({ ...formData, timeRequired: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                  placeholder="e.g., 5-10 minutes"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-white font-medium mb-2">Color Gradient</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Action Steps */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white font-medium">Action Steps</label>
                  <button
                    type="button"
                    onClick={addActionStep}
                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formData.action?.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-white/70 text-sm w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateActionStep(index, e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded p-2 text-white text-sm placeholder-white/50"
                        placeholder="Enter action step..."
                      />
                      {formData.action && formData.action.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActionStep(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Science - Mechanism */}
              <div>
                <label className="block text-white font-medium mb-2">Mechanism</label>
                <textarea
                  value={formData.science?.mechanism}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      science: { ...formData.science!, mechanism: e.target.value },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-20 text-sm"
                  placeholder="How does this biohack work biologically?"
                />
              </div>

              {/* Science - Studies */}
              <div>
                <label className="block text-white font-medium mb-2">Research Studies</label>
                <textarea
                  value={formData.science?.studies}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      science: { ...formData.science!, studies: e.target.value },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-20 text-sm"
                  placeholder="Research findings and statistics..."
                />
              </div>

              {/* Science - Biology */}
              <div>
                <label className="block text-white font-medium mb-2">Biology</label>
                <textarea
                  value={formData.science?.biology}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      science: { ...formData.science!, biology: e.target.value },
                    })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-20 text-sm"
                  placeholder="Detailed biological processes..."
                />
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
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Biohack</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
