"use client"

import { useState, useEffect } from "react"
import { useEducationEntries } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { GraduationCap, Plus, X, ChevronDown, ChevronUp, GripVertical } from "lucide-react"

const ICON_OPTIONS = ["GraduationCap", "Award", "BookOpen", "MapPin"]
const COLOR_OPTIONS = ["var(--accent-primary)", "var(--accent-secondary)"]

export default function EducationEditor() {
  const { data: entriesData, loading } = useEducationEntries()
  const [entries, setEntries] = useState<any[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [newBadge, setNewBadge] = useState("")

  useEffect(() => {
    if (entriesData) setEntries(entriesData.map((e) => ({ ...e })))
  }, [entriesData])

  const addEntry = () => {
    const newEntry = {
      id: `new-${Date.now()}`,
      degree: "",
      institution: "",
      duration: "",
      grade: "",
      description: "",
      badges: [],
      icon: "GraduationCap",
      color: "var(--accent-primary)",
      sort_order: entries.length,
    }
    setEntries((prev) => [...prev, newEntry])
    setExpanded(entries.length)
  }

  const updateEntry = (index: number, field: string, value: any) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
  }

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
    setExpanded(null)
  }

  const addBadge = (index: number) => {
    if (!newBadge.trim()) return
    const entry = entries[index]
    updateEntry(index, "badges", [...(entry.badges || []), newBadge.trim()])
    setNewBadge("")
  }

  const removeBadge = (entryIndex: number, badgeIndex: number) => {
    const entry = entries[entryIndex]
    updateEntry(entryIndex, "badges", entry.badges.filter((_: string, i: number) => i !== badgeIndex))
  }

  const handleSave = async () => {
    try {
      await fetch("/api/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: entries.map((e) => ({ ...e, id: undefined })) }),
      })
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Education saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-[color:var(--accent-primary)]" />
          Education Section
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Manage your education timeline entries.</p>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
          Entries ({entries.length})
        </label>
        <button onClick={addEntry} className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> Add Entry
        </button>
      </div>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={entry.id || i} className="rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] overflow-hidden">
            <div role="button" tabIndex={0} onClick={() => setExpanded(expanded === i ? null : i)} onKeyDown={(e) => e.key === "Enter" && setExpanded(expanded === i ? null : i)} className="flex w-full items-center gap-3 p-4 text-left cursor-pointer">
              <GripVertical className="h-4 w-4 shrink-0 text-[color:var(--text-secondary)]" />
              <span className="flex-1 text-sm font-bold text-[color:var(--text-primary)]">
                {entry.duration ? `${entry.duration} — ` : ""}{entry.degree || "Untitled"}
              </span>
              <button onClick={(e) => { e.stopPropagation(); removeEntry(i) }} className="shrink-0 rounded-md p-1 text-red-400 hover:bg-red-500/10">
                <X className="h-4 w-4" />
              </button>
              {expanded === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {expanded === i && (
              <div className="border-t border-[color:var(--card-border)] p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Degree</label>
                    <input value={entry.degree} onChange={(e) => updateEntry(i, "degree", e.target.value)} placeholder="Bachelors in CS" className="input-shell w-full rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Institution</label>
                    <input value={entry.institution} onChange={(e) => updateEntry(i, "institution", e.target.value)} placeholder="University Name" className="input-shell w-full rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Duration</label>
                    <input value={entry.duration} onChange={(e) => updateEntry(i, "duration", e.target.value)} placeholder="2022 - 2025" className="input-shell w-full rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Grade</label>
                    <input value={entry.grade} onChange={(e) => updateEntry(i, "grade", e.target.value)} placeholder="A+ Grade" className="input-shell w-full rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Description</label>
                  <textarea value={entry.description} onChange={(e) => updateEntry(i, "description", e.target.value)} rows={2} placeholder="What did you study?" className="input-shell w-full resize-none rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Icon</label>
                    <select value={entry.icon} onChange={(e) => updateEntry(i, "icon", e.target.value)} className="input-shell w-full rounded-lg px-3 py-2 text-sm">
                      {ICON_OPTIONS.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Color</label>
                    <select value={entry.color} onChange={(e) => updateEntry(i, "color", e.target.value)} className="input-shell w-full rounded-lg px-3 py-2 text-sm">
                      {COLOR_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[color:var(--text-secondary)]">Badges</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(entry.badges || []).map((badge: string, bi: number) => (
                      <div key={bi} className="flex items-center gap-1 rounded-full chip px-2.5 py-1">
                        <span className="text-xs font-semibold">{badge}</span>
                        <button onClick={() => removeBadge(i, bi)} className="text-red-400 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newBadge} onChange={(e) => setNewBadge(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge(i))} placeholder="Add badge" className="input-shell flex-1 rounded-lg px-3 py-1.5 text-sm" />
                    <button onClick={() => addBadge(i)} className="text-xs font-semibold text-[color:var(--accent-primary)] hover:underline">+ Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]">
        Save Education
      </button>
    </div>
  )
}
