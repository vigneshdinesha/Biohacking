"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Users, Zap, Search, Filter, Link2, Unlink } from "lucide-react"
import { getMotivations, getBiohacks, deleteMotivation, deleteBiohack, createMotivation, updateMotivation, createBiohack, updateBiohack, getMotivationBiohacksAll, linkMotivationBiohack, unlinkMotivationBiohack } from "@/lib/admin"
import MotivationForm from "@/components/admin/motivation-form"
import BiohackForm from "@/components/admin/biohack-form"

export default function AdminPage() {
  // Biohack category options (must match API category field values)
  const BIOHACK_CATEGORIES = [
    'Wellness & Balance',
    'Performance & Productivity',
    'Fitness & Physical Vitality',
    'Transformation & Self-Discovery',
    'Social Growth & Connection',
  ]
  const [activeTab, setActiveTab] = useState<"motivations" | "biohacks" | "mappings">("motivations")
  const [motivations, setMotivations] = useState<any[]>([])
  const [biohacks, setBiohacks] = useState<any[]>([])
  const [motivationBiohacks, setMotivationBiohacks] = useState<any[]>([])
  const [selectedMotivationId, setSelectedMotivationId] = useState<number | null>(null)
  const [mappingBusy, setMappingBusy] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Modal states
  const [showMotivationForm, setShowMotivationForm] = useState(false)
  const [showBiohackForm, setShowBiohackForm] = useState(false)
  const [editingMotivation, setEditingMotivation] = useState<any | null>(null)
  const [editingBiohack, setEditingBiohack] = useState<any | null>(null)


  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [motivationsRaw, biohacksRaw, mappingsRaw] = await Promise.all([
      getMotivations(),
      getBiohacks(),
      getMotivationBiohacksAll().catch(() => []),
    ])
    console.log('Raw motivations from API:', motivationsRaw)
    console.log('Raw biohacks from API:', biohacksRaw)
    console.log('Raw mappings from API:', mappingsRaw)

    // Map API fields to expected frontend fields
    const motivations = motivationsRaw.map((m: any) => ({
      id: m.id,
      title: m.title ?? '',
      description: m.description ?? '',
    }))
    const biohacks = biohacksRaw.map((b: any) => ({
      id: b.id,
      title: b.title ?? '',
      technique: b.technique ?? '',
      category: b.category ?? '',
      difficulty: b.difficulty ?? '',
      timeRequired: b.timeRequired ?? '',
      action: b.action ?? [],
      mechanism: b.mechanism ?? '',
      researchStudies: b.researchStudies ?? '',
      biology: b.biology ?? '',
      colorGradient: b.colorGradient ?? '',
    }))
    setMotivations(motivations)
    setBiohacks(biohacks)
  setMotivationBiohacks(mappingsRaw || [])
  if (motivations.length && selectedMotivationId === null) setSelectedMotivationId(motivations[0].id)
  }

  const handleSaveMotivation = async (motivation: any) => {
    console.log('💾 SAVE MOTIVATION - Received data:', motivation);
    console.log('💾 SAVE MOTIVATION - Current editing motivation:', editingMotivation);
    
    // If we're editing (editingMotivation exists), include the ID
    if (editingMotivation && editingMotivation.id) {
      const motivationWithId = { ...motivation, id: editingMotivation.id };
      console.log('✏️ SAVE MOTIVATION - Updating existing motivation with ID:', editingMotivation.id);
      await updateMotivation(editingMotivation.id, motivationWithId);
    } else {
      console.log('➕ SAVE MOTIVATION - Creating new motivation');
      await createMotivation(motivation);
    }
    await loadData();
    setEditingMotivation(null);
  }

  const handleSaveBiohack = async (biohack: any) => {
    // Mirror motivation handling: when editing, use the selected biohack's ID
    if (editingBiohack && editingBiohack.id) {
      await updateBiohack(editingBiohack.id, biohack)
    } else {
      await createBiohack(biohack)
    }
    await loadData()
    setEditingBiohack(null)
  }

  const handleDeleteMotivation = async (id: number) => {
    console.log('🗑️ DELETE MOTIVATION - Starting delete process for ID:', id);
    console.log('🗑️ DELETE MOTIVATION - Motivation object:', motivations.find(m => m.id === id));
    
    if (confirm("Are you sure you want to delete this motivation?")) {
      try {
        console.log('🗑️ DELETE MOTIVATION - User confirmed, calling deleteMotivation API...');
        const result = await deleteMotivation(id);
        console.log('🗑️ DELETE MOTIVATION - API call successful, result:', result);
        
        console.log('🗑️ DELETE MOTIVATION - Reloading data...');
        await loadData();
        console.log('🗑️ DELETE MOTIVATION - Data reloaded successfully');
      } catch (error) {
        console.error('❌ DELETE MOTIVATION - Error occurred:', error);
        alert('Failed to delete motivation: ' + (error as Error).message);
      }
    } else {
      console.log('🗑️ DELETE MOTIVATION - User cancelled deletion');
    }
  }

  const handleDeleteBiohack = async (id: number) => {
    if (confirm("Are you sure you want to delete this biohack?")) {
      await deleteBiohack(id)
      await loadData()
    }
  }

  const filteredMotivations = motivations.filter((motivation) => {
    if (!motivation || typeof motivation.title !== 'string' || typeof motivation.description !== 'string') return false;
    const matchesSearch =
      motivation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motivation.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredBiohacks = biohacks.filter((biohack) => {
    if (!biohack || typeof biohack.title !== 'string' || typeof biohack.technique !== 'string') return false;
    const matchesSearch =
      biohack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biohack.technique.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || biohack.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Mapping helpers
  const isLinked = (motivationId: number, biohackId: number) =>
    motivationBiohacks.some(mb => mb.motivationId === motivationId && mb.biohackId === biohackId)

  const toggleLink = async (biohackId: number) => {
    if (selectedMotivationId == null) return
    setMappingBusy(true)
    try {
      if (isLinked(selectedMotivationId, biohackId)) {
        await unlinkMotivationBiohack(selectedMotivationId, biohackId)
        setMotivationBiohacks(prev => prev.filter(mb => !(mb.motivationId === selectedMotivationId && mb.biohackId === biohackId)))
      } else {
        try {
          await linkMotivationBiohack(selectedMotivationId, biohackId)
          setMotivationBiohacks(prev => [...prev, { motivationId: selectedMotivationId, biohackId }])
        } catch (e: any) {
          // Handle conflict (relationship exists) gracefully
          if (String(e.message).includes('409') || String(e.message).toLowerCase().includes('exists')) {
            // Force refresh mappings
            const fresh = await getMotivationBiohacksAll().catch(() => [])
            setMotivationBiohacks(fresh)
          } else {
            throw e
          }
        }
      }
    } catch (err) {
      console.error('Mapping toggle failed', err)
      alert('Link/unlink failed: ' + (err as Error).message)
    } finally {
      setMappingBusy(false)
    }
  }

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
          <button
            onClick={() => setActiveTab("mappings")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm flex items-center space-x-2 ${
              activeTab === "mappings" ? "bg-white text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Mappings</span>
          </button>
        </div>

        {/* Controls */}
  {activeTab !== 'mappings' && (
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

            {activeTab === "biohacks" && (
              <div className="relative">
                <Filter className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-8 py-2 text-white appearance-none"
                >
                  <option value="all">All Categories</option>
                  {BIOHACK_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
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
  )}

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
                      onClick={() => {
                        console.log('🖱️ DELETE BUTTON CLICKED - Motivation ID:', motivation.id, 'Title:', motivation.title);
                        handleDeleteMotivation(motivation.id);
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
  ) : activeTab === 'biohacks' ? (
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
                  <p className="text-white/50 text-xs mb-2">Action Steps: {(biohack.action ? biohack.action.length : 0)}</p>
                  <div className="text-xs text-white/70">
                    {biohack.action && biohack.action[0] ? biohack.action[0].substring(0, 60) : ''}
                    {biohack.action && biohack.action[0] && biohack.action[0].length > 60 ? "..." : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Mappings tab
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2"><Link2 className="w-4 h-4" /><span>Link Motivations to Biohacks</span></h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Motivation Selector */}
                <div className="md:col-span-1 space-y-4">
                  <label className="block text-white text-sm font-medium">Select Motivation</label>
                  <select
                    value={selectedMotivationId ?? ''}
                    onChange={e => setSelectedMotivationId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    {motivations.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                  {selectedMotivationId != null && (
                    <div className="text-xs text-white/60">
                      Linked Biohacks: {motivationBiohacks.filter(mb => mb.motivationId === selectedMotivationId).length}
                    </div>
                  )}
                </div>
                {/* Biohack list */}
                <div className="md:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {biohacks.map(b => {
                    const linked = selectedMotivationId != null && isLinked(selectedMotivationId, b.id)
                    return (
                      <button
                        key={b.id}
                        onClick={() => !mappingBusy && toggleLink(b.id)}
                        disabled={selectedMotivationId == null || mappingBusy}
                        className={`text-left p-4 rounded-lg border transition-colors relative group ${linked ? 'border-green-400/60 bg-green-500/10' : 'border-white/20 bg-white/5 hover:border-white/40'} disabled:opacity-50`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-white pr-2 line-clamp-2">{b.title || 'Untitled'}</span>
                          {linked ? <Link2 className="w-4 h-4 text-green-400" /> : <Unlink className="w-4 h-4 text-white/40 group-hover:text-white/70" />}
                        </div>
                        <p className="text-xs text-white/60 line-clamp-3 mb-2">{b.technique}</p>
                        <div className="flex flex-wrap gap-1">
                          {b.category && <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">{b.category}</span>}
                          {b.difficulty && <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-200">{b.difficulty}</span>}
                        </div>
                        {linked && <span className="absolute top-2 right-2 text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Linked</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Current mappings overview */}
            {selectedMotivationId != null && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-3 text-sm">Current Links</h4>
                <div className="flex flex-wrap gap-2">
                  {motivationBiohacks.filter(mb => mb.motivationId === selectedMotivationId).map(mb => {
                    const b = biohacks.find(bh => bh.id === mb.biohackId)
                    if (!b) return null
                    return (
                      <span key={mb.biohackId} className="inline-flex items-center space-x-1 bg-white/10 px-2 py-1 rounded text-xs text-white">
                        <span>{b.title}</span>
                        <button
                          onClick={() => toggleLink(b.id)}
                          className="text-red-300 hover:text-red-400"
                          title="Unlink"
                        >
                          ×
                        </button>
                      </span>
                    )
                  })}
                  {motivationBiohacks.filter(mb => mb.motivationId === selectedMotivationId).length === 0 && (
                    <span className="text-white/50 text-xs">No biohacks linked yet.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty States */}
        {activeTab === "motivations" && filteredMotivations.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No motivations found</h3>
            <p className="text-white/70 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
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
