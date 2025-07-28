"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Users, Zap, Search, Filter } from "lucide-react"
import { AdminManager, type Motivation, type AdminBiohack } from "@/lib/admin"
import MotivationForm from "@/components/admin/motivation-form"
import BiohackForm from "@/components/admin/biohack-form"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"motivations" | "biohacks">("motivations")
  const [motivations, setMotivations] = useState<Motivation[]>([])
  const [biohacks, setBiohacks] = useState<AdminBiohack[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Modal states
  const [showMotivationForm, setShowMotivationForm] = useState(false)
  const [showBiohackForm, setShowBiohackForm] = useState(false)
  const [editingMotivation, setEditingMotivation] = useState<Motivation | null>(null)
  const [editingBiohack, setEditingBiohack] = useState<AdminBiohack | null>(null)

  useEffect(() => {
    AdminManager.initializeSampleData()
    loadData()
  }, [])

  const loadData = () => {
    setMotivations(AdminManager.getMotivations())
    setBiohacks(AdminManager.getAdminBiohacks())
  }

  const handleSaveMotivation = (motivation: Motivation) => {
    AdminManager.saveMotivation(motivation)
    loadData()
    setEditingMotivation(null)
  }

  const handleSaveBiohack = (biohack: AdminBiohack) => {
    AdminManager.saveAdminBiohack(biohack)
    loadData()
    setEditingBiohack(null)
  }

  const handleDeleteMotivation = (id: string) => {
    if (confirm("Are you sure you want to delete this motivation?")) {
      AdminManager.deleteMotivation(id)
      loadData()
    }
  }

  const handleDeleteBiohack = (id: string) => {
    if (confirm("Are you sure you want to delete this biohack?")) {
      AdminManager.deleteAdminBiohack(id)
      loadData()
    }
  }

  const filteredMotivations = motivations.filter((motivation) => {
    const matchesSearch =
      motivation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motivation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || motivation.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const filteredBiohacks = biohacks.filter((biohack) => {
    const matchesSearch =
      biohack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biohack.technique.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || biohack.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* DNA Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="dna" x="0" y="0" width="100" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M20 0 Q50 50 80 100 Q50 150 20 200 M80 0 Q50 50 20 100 Q50 150 80 200"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M20 0 Q50 50 80 100 Q50 150 20 200 M80 0 Q50 50 20 100 Q50 150 80 200"
                stroke="#06b6d4"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
                transform="translate(100, 0)"
              />
              <g stroke="#8b5cf6" strokeWidth="1" opacity="0.3">
                <line x1="20" y1="25" x2="80" y2="25" />
                <line x1="35" y1="50" x2="65" y2="50" />
                <line x1="20" y1="75" x2="80" y2="75" />
                <line x1="35" y1="100" x2="65" y2="100" />
                <line x1="20" y1="125" x2="80" y2="125" />
                <line x1="35" y1="150" x2="65" y2="150" />
                <line x1="20" y1="175" x2="80" y2="175" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dna)" />
        </svg>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Manage motivations and biohacks for the platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab("motivations")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm flex items-center space-x-2 ${
              activeTab === "motivations" ? "bg-white text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Motivations ({motivations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("biohacks")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm flex items-center space-x-2 ${
              activeTab === "biohacks" ? "bg-white text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Biohacks ({biohacks.length})</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 w-64"
              />
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-8 py-2 text-white appearance-none"
              >
                <option value="all">All Categories</option>
                {activeTab === "motivations" ? (
                  <>
                    <option value="energy">Energy</option>
                    <option value="focus">Focus</option>
                    <option value="sleep">Sleep</option>
                    <option value="stress">Stress</option>
                    <option value="performance">Performance</option>
                    <option value="wellness">Wellness</option>
                  </>
                ) : (
                  <>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="feel-good">Feel Good</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              if (activeTab === "motivations") {
                setEditingMotivation(null)
                setShowMotivationForm(true)
              } else {
                setEditingBiohack(null)
                setShowBiohackForm(true)
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === "motivations" ? "Motivation" : "Biohack"}</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "motivations" ? (
          /* Motivations Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotivations.map((motivation) => (
              <div key={motivation.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{motivation.title}</h3>
                    <p className="text-white/70 text-sm mb-3">{motivation.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                        {motivation.category}
                      </span>
                      <span className="text-white/50 text-xs">{motivation.mappedBiohacks.length} biohacks</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingMotivation(motivation)
                        setShowMotivationForm(true)
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMotivation(motivation.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {motivation.mappedBiohacks.length > 0 && (
                  <div>
                    <p className="text-white/50 text-xs mb-2">Mapped Biohacks:</p>
                    <div className="flex flex-wrap gap-1">
                      {motivation.mappedBiohacks.slice(0, 3).map((biohack, index) => (
                        <span key={index} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                          {biohack.length > 20 ? biohack.substring(0, 20) + "..." : biohack}
                        </span>
                      ))}
                      {motivation.mappedBiohacks.length > 3 && (
                        <span className="text-white/50 text-xs">+{motivation.mappedBiohacks.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Biohacks Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBiohacks.map((biohack) => (
              <div key={biohack.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{biohack.title}</h3>
                    <p className="text-white/70 text-sm mb-3">{biohack.technique}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                        {biohack.category}
                      </span>
                      <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs font-medium">
                        {biohack.difficulty}
                      </span>
                      {biohack.timeRequired && <span className="text-white/50 text-xs">{biohack.timeRequired}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingBiohack(biohack)
                        setShowBiohackForm(true)
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBiohack(biohack.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs mb-2">Action Steps: {biohack.action.length}</p>
                  <div className="text-xs text-white/70">
                    {biohack.action[0]?.substring(0, 60)}
                    {biohack.action[0]?.length > 60 && "..."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {activeTab === "motivations" && filteredMotivations.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No motivations found</h3>
            <p className="text-white/70 mb-4">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first motivation to get started"}
            </p>
          </div>
        )}

        {activeTab === "biohacks" && filteredBiohacks.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No biohacks found</h3>
            <p className="text-white/70 mb-4">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first biohack to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <MotivationForm
        isOpen={showMotivationForm}
        onClose={() => setShowMotivationForm(false)}
        onSave={handleSaveMotivation}
        motivation={editingMotivation}
      />

      <BiohackForm
        isOpen={showBiohackForm}
        onClose={() => setShowBiohackForm(false)}
        onSave={handleSaveBiohack}
        biohack={editingBiohack}
      />
    </div>
  )
}
