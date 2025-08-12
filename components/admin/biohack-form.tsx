"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Save, Plus, Minus, Info, ExternalLink } from "lucide-react"

interface BiohackFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (biohack: any) => void
  biohack?: any | null
}

const CATEGORIES = [
  "Wellness & Balance",
  "Performance & Productivity", 
  "Fitness & Physical Vitality",
  "Transformation & Self-Discovery",
  "Social Growth & Connection",
]

const DIFFICULTIES = ["Easy", "Moderate", "Advanced"]
const TIME_REQUIRED = ["Short (≤30 min, acute)", "Long (multi-week lifestyle)"]

const QUICK_TEMPLATES = {
  "Breathwork": {
    title: "4-7-8 Breathing Protocol",
    technique: "Inhale 4, hold 7, exhale 8 seconds",
    category: "Wellness & Balance",
    difficulty: "Easy",
    timeRequired: "Short (≤30 min, acute)",
    action: [
      "Sit comfortably with back straight",
      "Exhale completely through mouth",
      "Close mouth, inhale through nose for 4 counts",
      "Hold breath for 7 counts",
      "Exhale through mouth for 8 counts",
      "Repeat cycle 4-8 times"
    ],
    mechanism: "Activates parasympathetic nervous system through controlled CO2 retention and vagal stimulation.",
  },
  "Light Therapy": {
    title: "Morning Bright-Light Therapy (10k lux)",
    technique: "30 min 10,000-lux light within 60 min of waking",
    category: "Wellness & Balance", 
    difficulty: "Easy",
    timeRequired: "Short (≤30 min, acute)",
    action: [
      "Use 10,000 lux light therapy device",
      "Position 16-24 inches from face",
      "Expose within 60 minutes of waking",
      "Continue for 20-30 minutes",
      "Avoid looking directly at light"
    ],
    mechanism: "Resets circadian rhythm via melanopsin-containing retinal ganglion cells signaling to suprachiasmatic nucleus.",
  },
  "Creatine Protocol": {
    title: "Creatine Monohydrate Loading Protocol",
    technique: "5g daily creatine monohydrate post-workout",
    category: "Fitness & Physical Vitality",
    difficulty: "Easy", 
    timeRequired: "Long (multi-week lifestyle)",
    action: [
      "Take 5g creatine monohydrate powder",
      "Mix with 16-20oz water or juice",
      "Consume within 30 minutes post-workout",
      "On rest days, take with breakfast",
      "Maintain consistent daily timing"
    ],
    mechanism: "Increases phosphocreatine stores in muscle tissue, enhancing ATP regeneration during high-intensity exercise.",
  }
}

export default function BiohackForm({ isOpen, onClose, onSave, biohack }: BiohackFormProps) {
  // Helper: parse researchStudies from API (string or JSON) into UI-friendly array
  const parseResearchStudies = (input: any): { summary: string; sourceURL: string }[] => {
    try {
      if (!input) return [{ summary: "", sourceURL: "" }]
      if (Array.isArray(input)) {
        // Already array (from client state)
        if (input.length === 0) return [{ summary: "", sourceURL: "" }]
        if (typeof input[0] === 'string') {
          return (input as string[]).map(s => ({ summary: s, sourceURL: "" }))
        }
        return input as { summary: string; sourceURL: string }[]
      }
      if (typeof input === 'string') {
        const trimmed = input.trim()
        if (!trimmed) return [{ summary: "", sourceURL: "" }]
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) {
            if (parsed.length === 0) return [{ summary: "", sourceURL: "" }]
            if (typeof parsed[0] === 'string') return parsed.map((s: string) => ({ summary: s, sourceURL: "" }))
            return parsed as { summary: string; sourceURL: string }[]
          }
        } catch {
          // Not JSON, treat as single summary string
          return [{ summary: trimmed, sourceURL: "" }]
        }
      }
    } catch {}
    return [{ summary: "", sourceURL: "" }]
  }

  const [formData, setFormData] = useState({
    title: "",
    technique: "",
    category: "",
    difficulty: "",
    timeRequired: "",
    action: [""],
    mechanism: "",
    researchStudies: [{ summary: "", sourceURL: "" }],
    biology: "",
    colorGradient: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (biohack) {
      setFormData({
        title: biohack.title || "",
        technique: biohack.technique || "",
        category: biohack.category || "",
        difficulty: biohack.difficulty || "",
        timeRequired: biohack.timeRequired || "",
  action: biohack.action || [""],
        mechanism: biohack.mechanism || "",
  researchStudies: parseResearchStudies(biohack.researchStudies),
        biology: biohack.biology || "",
        colorGradient: biohack.colorGradient || "",
      })
    } else {
      setFormData({
        title: "",
        technique: "",
        category: "",
        difficulty: "",
        timeRequired: "",
        action: [""],
        mechanism: "",
        researchStudies: [{ summary: "", sourceURL: "" }],
        biology: "",
        colorGradient: "",
      })
    }
    setHasUnsavedChanges(false)
  }, [biohack])

  const validateColor = (color: string): boolean => {
    if (!color) return true // Optional field
    const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/
    const gradientPattern = /linear-gradient\(/
    return hexPattern.test(color) || gradientPattern.test(color)
  }

  const validateURL = (url: string): boolean => {
    return url.startsWith("http://") || url.startsWith("https://")
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.technique.trim()) {
      newErrors.technique = "Technique is required"
    } else {
      const wordCount = formData.technique.trim().split(/\s+/).length
      if (wordCount < 3 || wordCount > 10) {
        newErrors.technique = "Technique should be 3-10 words"
      }
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.difficulty) {
      newErrors.difficulty = "Difficulty is required"
    }

    if (!formData.timeRequired) {
      newErrors.timeRequired = "Time required is required"
    }

    const validActions = formData.action.filter(step => step.trim())
    if (validActions.length < 3) {
      newErrors.action = "At least 3 action steps are required"
    }

    if (!formData.mechanism.trim()) {
      newErrors.mechanism = "Mechanism is required"
    }

    const validStudies = formData.researchStudies.filter(study => 
      study.summary.trim() && study.sourceURL.trim()
    )
    if (validStudies.length === 0) {
      newErrors.researchStudies = "At least one complete research study is required"
    }

    formData.researchStudies.forEach((study, index) => {
      if (study.summary.trim() && study.summary.length > 200) {
        newErrors[`study_${index}_summary`] = "Summary must be ≤200 characters"
      }
      if (study.sourceURL.trim() && !validateURL(study.sourceURL)) {
        newErrors[`study_${index}_url`] = "URL must start with http:// or https://"
      }
    })

    if (formData.colorGradient && !validateColor(formData.colorGradient)) {
      newErrors.colorGradient = "Must be a valid hex color (#123456) or CSS gradient"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const validStudies = formData.researchStudies.filter(study => 
      study.summary.trim() && study.sourceURL.trim()
    )
    const normalizedData = {
      title: formData.title.trim(),
      technique: formData.technique.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      timeRequired: formData.timeRequired,
      action: formData.action.filter(step => step.trim()),
      mechanism: formData.mechanism.trim(),
      // API expects a string; store JSON string of studies for compatibility
      researchStudies: JSON.stringify(validStudies),
      biology: formData.biology.trim() || undefined,
      colorGradient: formData.colorGradient.trim() || undefined,
    }

    onSave(normalizedData)
    setHasUnsavedChanges(false)
    onClose()
  }

  const addActionStep = () => {
    setFormData(prev => ({
      ...prev,
      action: [...prev.action, ""],
    }))
    setHasUnsavedChanges(true)
  }

  const removeActionStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      action: prev.action.filter((_, i) => i !== index),
    }))
    setHasUnsavedChanges(true)
  }

  const updateActionStep = (index: number, value: string) => {
    const newAction = [...formData.action]
    newAction[index] = value
    setFormData(prev => ({ ...prev, action: newAction }))
    setHasUnsavedChanges(true)
  }

  const addResearchStudy = () => {
    setFormData(prev => ({
      ...prev,
      researchStudies: [...prev.researchStudies, { summary: "", sourceURL: "" }],
    }))
    setHasUnsavedChanges(true)
  }

  const removeResearchStudy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      researchStudies: prev.researchStudies.filter((_, i) => i !== index),
    }))
    setHasUnsavedChanges(true)
  }

  const updateResearchStudy = (index: number, field: "summary" | "sourceURL", value: string) => {
    const newStudies = [...formData.researchStudies]
    newStudies[index] = { ...newStudies[index], [field]: value }
    setFormData(prev => ({ ...prev, researchStudies: newStudies }))
    setHasUnsavedChanges(true)
  }

  const applyTemplate = (templateKey: string) => {
    const template = QUICK_TEMPLATES[templateKey as keyof typeof QUICK_TEMPLATES]
    setFormData(prev => ({
      ...prev,
      ...template,
      researchStudies: prev.researchStudies, // Keep existing research studies
    }))
    setHasUnsavedChanges(true)
  }

  const suggestCategory = () => {
    const text = (formData.title + " " + formData.technique).toLowerCase()
    if (text.includes("sleep") || text.includes("circadian") || text.includes("rest")) {
      return "Wellness & Balance"
    }
    if (text.includes("focus") || text.includes("cognitive") || text.includes("productivity")) {
      return "Performance & Productivity"
    }
    if (text.includes("strength") || text.includes("cardio") || text.includes("fitness")) {
      return "Fitness & Physical Vitality"
    }
    return ""
  }

  useEffect(() => {
    if (!formData.category && (formData.title || formData.technique)) {
      const suggested = suggestCategory()
      if (suggested) {
        setFormData(prev => ({ ...prev, category: suggested }))
      }
    }
  }, [formData.title, formData.technique, formData.category])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900/95 backdrop-blur-md rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Plus className="w-6 h-6 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">{biohack ? "Edit Biohack" : "Create Biohack"}</h2>
              {hasUnsavedChanges && <span className="ml-3 text-yellow-400 text-sm">• Unsaved changes</span>}
            </div>
            
            {/* Quick Templates */}
            <div className="flex space-x-2">
              {Object.keys(QUICK_TEMPLATES).map(template => (
                <button
                  key={template}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Title *
                  <span className="inline-block ml-1 text-blue-400 cursor-help" title="Short, specific name. Example: 'Morning Bright-Light Therapy (10k lux)'">
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                  placeholder="e.g., Morning Bright-Light Therapy (10k lux)"
                  required
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Technique */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Technique *
                  <span className="inline-block ml-1 text-blue-400 cursor-help" title="3-10 words describing the specific method">
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.technique}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, technique: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                  placeholder="e.g., 30 min 10,000-lux light within 60 min of waking"
                  required
                />
                {errors.technique && <p className="text-red-400 text-sm mt-1">{errors.technique}</p>}
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, category: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    required
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, difficulty: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                    required
                  >
                    <option value="">Select difficulty...</option>
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                  {errors.difficulty && <p className="text-red-400 text-sm mt-1">{errors.difficulty}</p>}
                </div>
              </div>

              {/* Time Required */}
              <div>
                <label className="block text-white font-medium mb-2">Time Required *</label>
                <select
                  value={formData.timeRequired}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, timeRequired: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  required
                >
                  <option value="">Select time requirement...</option>
                  {TIME_REQUIRED.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.timeRequired && <p className="text-red-400 text-sm mt-1">{errors.timeRequired}</p>}
              </div>

              {/* Color Gradient */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Color Gradient
                  <span className="inline-block ml-1 text-blue-400 cursor-help" title="Hex color (#123456) or CSS gradient for visual styling">
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.colorGradient}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, colorGradient: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                    placeholder="#FF6B6B or linear-gradient(45deg, #FF6B6B, #4ECDC4)"
                  />
                  {formData.colorGradient && validateColor(formData.colorGradient) && (
                    <div 
                      className="w-8 h-8 rounded border border-white/20"
                      style={{ background: formData.colorGradient }}
                    />
                  )}
                </div>
                {errors.colorGradient && <p className="text-red-400 text-sm mt-1">{errors.colorGradient}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Action Steps */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Action Steps * (3-10 steps)
                  <span className="inline-block ml-1 text-blue-400 cursor-help" title="Step-by-step instructions, each ≤160 characters">
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <div className="space-y-2">
                  {formData.action.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-white/50 text-sm w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateActionStep(index, e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                        placeholder="Enter action step..."
                        maxLength={160}
                      />
                      {formData.action.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActionStep(index)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addActionStep}
                    className="w-full p-2 border border-dashed border-white/30 rounded-lg text-white/70 hover:border-white/50 hover:text-white transition-colors"
                  >
                    + Add Step
                  </button>
                </div>
                {errors.action && <p className="text-red-400 text-sm mt-1">{errors.action}</p>}
              </div>

              {/* Mechanism */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Mechanism *
                  <span className="inline-block ml-1 text-blue-400 cursor-help" title="1-3 sentences on biological/physiological mechanism">
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <textarea
                  value={formData.mechanism}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, mechanism: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-20"
                  placeholder="Explain the biological/physiological mechanism in 1-3 sentences..."
                  required
                />
                {errors.mechanism && <p className="text-red-400 text-sm mt-1">{errors.mechanism}</p>}
              </div>

              {/* Biology */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Biology
                  <span className="inline-block ml-1 text-blue-400 cursor-help" title="Optional deeper pathway details (receptors, hormones, circuits)">
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <textarea
                  value={formData.biology}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, biology: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-20"
                  placeholder="Optional: Deeper biological pathways, receptors, hormones, neural circuits..."
                />
              </div>
            </div>
          </div>

          {/* Research Studies */}
          <div className="mt-6">
            <label className="block text-white font-medium mb-2">
              Research Studies * (≥1 required)
              <span className="inline-block ml-1 text-blue-400 cursor-help" title="Supporting research with summary and source URL (prefer PubMed/PMC/DOI)">
                <Info className="w-4 h-4" />
              </span>
            </label>
            <div className="space-y-4">
              {formData.researchStudies.map((study, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Study {index + 1}</span>
                    {formData.researchStudies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResearchStudy(index)}
                        className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={study.summary}
                        onChange={(e) => updateResearchStudy(index, "summary", e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                        placeholder="Brief summary of research findings (≤200 chars)..."
                        maxLength={200}
                      />
                      <div className="flex justify-between text-xs text-white/50 mt-1">
                        <span>{errors[`study_${index}_summary`] && <span className="text-red-400">{errors[`study_${index}_summary`]}</span>}</span>
                        <span>{study.summary.length}/200</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          value={study.sourceURL}
                          onChange={(e) => updateResearchStudy(index, "sourceURL", e.target.value)}
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                          placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                        />
                        {study.sourceURL && validateURL(study.sourceURL) && (
                          <a
                            href={study.sourceURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {errors[`study_${index}_url`] && <p className="text-red-400 text-xs mt-1">{errors[`study_${index}_url`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addResearchStudy}
                className="w-full p-3 border border-dashed border-white/30 rounded-lg text-white/70 hover:border-white/50 hover:text-white transition-colors"
              >
                + Add Research Study
              </button>
            </div>
            {errors.researchStudies && <p className="text-red-400 text-sm mt-1">{errors.researchStudies}</p>}
          </div>

          <div className="flex justify-end space-x-3 mt-8">
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
