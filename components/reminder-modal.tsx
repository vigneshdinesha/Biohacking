"use client"

import { useState } from "react"
import { X, Bell, Clock } from "lucide-react"

interface ReminderModalProps {
  isOpen: boolean
  onClose: () => void
  biohackTitle: string
}

export default function ReminderModal({ isOpen, onClose, biohackTitle }: ReminderModalProps) {
  const [reminderTime, setReminderTime] = useState("09:00")
  const [reminderDays, setReminderDays] = useState<string[]>(["monday", "wednesday", "friday"])
  const [reminderType, setReminderType] = useState<"daily" | "weekly" | "custom">("weekly")

  if (!isOpen) return null

  const handleSetReminder = () => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Save reminder preferences
          const reminder = {
            biohackTitle,
            time: reminderTime,
            days: reminderDays,
            type: reminderType,
            active: true,
          }

          const existingReminders = JSON.parse(localStorage.getItem("biohack_reminders") || "[]")
          existingReminders.push(reminder)
          localStorage.setItem("biohack_reminders", JSON.stringify(existingReminders))

          // Show confirmation
          alert(`Reminder set for ${biohackTitle}!`)
          onClose()
        }
      })
    }
  }

  const days = [
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
    { id: "sunday", label: "Sun" },
  ]

  const toggleDay = (dayId: string) => {
    setReminderDays((prev) => (prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900/95 backdrop-blur-md rounded-2xl max-w-md w-full p-6 border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Bell className="w-6 h-6 text-green-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Set Reminder</h2>
          </div>
          <p className="text-white/70 text-sm">Get notified to practice: {biohackTitle}</p>
        </div>

        <div className="space-y-4">
          {/* Reminder Type */}
          <div>
            <label className="block text-white font-medium mb-2">Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {["daily", "weekly", "custom"].map((type) => (
                <button
                  key={type}
                  onClick={() => setReminderType(type as any)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    reminderType === type ? "bg-green-500 text-white" : "bg-white/10 text-white/70"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-white font-medium mb-2">Time</label>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          {/* Days Selection (for weekly/custom) */}
          {reminderType !== "daily" && (
            <div>
              <label className="block text-white font-medium mb-2">Days</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      reminderDays.includes(day.id) ? "bg-blue-500 text-white" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSetReminder}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Bell className="w-5 h-5" />
            <span>Set Reminder</span>
          </button>
        </div>
      </div>
    </div>
  )
}
