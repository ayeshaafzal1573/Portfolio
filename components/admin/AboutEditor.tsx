"use client"

import { useState, useEffect } from "react"
import { useAbout, useSkills } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { User, Plus, X, GripVertical, ChevronDown, ChevronUp, Code, Database, Palette, Smartphone, Globe, Zap, Radio, BarChart2, ShieldCheck, Users } from "lucide-react"

const ICON_OPTIONS = ["Code", "Database", "Palette", "Smartphone", "Globe", "Zap", "Radio", "BarChart2", "ShieldCheck", "Users"]

const ICON_MAP: Record<string, React.ComponentType<any>> = { Code, Database, Palette, Smartphone, Globe, Zap, Radio, BarChart2, ShieldCheck, Users }

export default function AboutEditor() {
  const { data: aboutData, loading: aboutLoading } = useAbout()
  const { data: skillsData, loading: skillsLoading } = useSkills()
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState<any[]>([])
  const [newSkill, setNewSkill] = useState({ name: "", level: 75, icon: "Code" })

  useEffect(() => {
    if (aboutData) setDescription(aboutData.description || "")
  }, [aboutData])

  useEffect(() => {
    if (skillsData) setSkills(skillsData.map((s) => ({ id: s.id, name: s.name, level: s.level, icon: s.icon })))
  }, [skillsData])

  const addSkill = () => {
    if (!newSkill.name.trim()) return
    setSkills((prev) => [...prev, { ...newSkill, id: `new-${Date.now()}` }])
    setNewSkill({ name: "", level: 75, icon: "Code" })
  }

  const updateSkill = (index: number, field: string, value: any) => {
    setSkills((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      await Promise.all([
        fetch("/api/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }),
        fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: skills.map((s) => ({ name: s.name, level: s.level, icon: s.icon })) }),
        }),
      ])
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("About section saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  if (aboutLoading || skillsLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
          <User className="h-6 w-6 text-[color:var(--accent-primary)]" />
          About Section
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Edit your bio and core skills.</p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Bio / Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Write about yourself..." className="input-shell w-full resize-none rounded-xl px-4 py-3 text-sm" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Core Skills ({skills.length})</label>
        </div>
        <div className="space-y-3">
          {skills.map((skill, i) => (
            <div key={skill.id || i} className="flex flex-col gap-3 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-4 sm:flex-row sm:items-center">
              <input value={skill.name} onChange={(e) => updateSkill(i, "name", e.target.value)} placeholder="Skill name" className="input-shell flex-1 rounded-lg px-3 py-2 text-sm" />
              <div className="flex items-center gap-2">
                <div className="flex shrink-0 items-center justify-center h-9 w-9 rounded-lg bg-[color:var(--accent-soft)]">
                  {(() => { const Ic = ICON_MAP[skill.icon] || Code; return <Ic className="h-4 w-4 text-[color:var(--accent-primary)]" /> })()}
                </div>
                <select value={skill.icon} onChange={(e) => updateSkill(i, "icon", e.target.value)} className="input-shell rounded-lg px-2 py-2 text-sm w-36">
                  {ICON_OPTIONS.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-2 w-40">
                <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkill(i, "level", Number(e.target.value))} className="flex-1 accent-[color:var(--accent-primary)]" />
                <span className="text-xs font-bold text-[color:var(--accent-primary)] w-8 text-right">{skill.level}%</span>
              </div>
              <button onClick={() => removeSkill(i)} className="shrink-0 rounded-md p-1.5 text-red-400 hover:bg-red-500/10">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={newSkill.name} onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="New skill name" className="input-shell flex-1 rounded-lg px-3 py-2 text-sm" />
          <button onClick={addSkill} className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold">
            <Plus className="h-4 w-4" /> Add Skill
          </button>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]">
        Save About Section
      </button>
    </div>
  )
}
