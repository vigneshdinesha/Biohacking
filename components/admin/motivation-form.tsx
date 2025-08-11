
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";

interface MotivationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (motivation: any) => void;
  motivation?: any | null;
}

export default function MotivationForm({ isOpen, onClose, onSave, motivation }: MotivationFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (motivation) {
      setFormData({
        title: motivation.title || "",
        description: motivation.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [motivation]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Send exactly what the API expects: title, description
    const motivationData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    onSave(motivationData);
    onClose();
  };

  if (!isOpen) return null;

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
              <label className="block text-white font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50"
                placeholder="Enter motivation title..."
                required
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none h-24"
                placeholder="Enter motivation description..."
                required
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
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
  );
}