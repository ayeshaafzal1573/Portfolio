"use client"

import { useState, useEffect, useRef } from "react"
import { useAbout, useSkills } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Plus, X, Code, Database, Palette, Smartphone, Globe, Zap, Radio, BarChart2, ShieldCheck, Users, Save } from "lucide-react"
import { Button, IconButton, Card, Field, TextArea } from "@/components/admin/ui"

const ICON_OPTIONS = ["Code", "Database", "Palette", "Smartphone", "Globe", "Zap", "Radio", "BarChart2", "ShieldCheck", "Users"]

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = { Code, Database, Palette, Smartphone, Globe, Zap, Radio, BarChart2, ShieldCheck, Users }

const skillsSig = (list: any[]) =>
  JSON.stringify(list.map((s) => ({ name: s.name, level: s.level, icon: s.icon })))

export default function AboutEditor() {
  const { data: aboutData, loading: aboutLoading } = useAbout()
  const { data: skillsData, loading: skillsLoading } = useSkills()
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState<any[]>([])
  const [newSkill, setNewSkill] = useState({ name: "", level: 75, icon: "Code" })
  const [saving, setSaving] = useState(false)
  const loadedSkillsSig = useRef("")

  useEffect(() => {
    if (aboutData) setDescription(aboutData.description || "")
  }, [aboutData])

  useEffect(() => {
    if (skillsData) {
      const next = skillsData.map((s) => ({ id: s.id, name: s.name, level: s.level, icon: s.icon }))
      setSkills(next)
      loadedSkillsSig.current = skillsSig(next)
    }
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
    const skillsChanged = skillsSig(skills) !== loadedSkillsSig.current
    if (skillsChanged && skills.length === 0) {
      const confirmed = window.confirm(
        "This will remove ALL core skills. Are you sure you want to save?"
      )
      if (!confirmed) return
    }

    setSaving(true)
    try {
      const requests: Promise<Response>[] = [
        fetch("/api/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }),
      ]

      if (skillsChanged) {
        requests.push(
          fetch("/api/skills", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills: skills.map((s) => ({ name: s.name, level: s.level, icon: s.icon })) }),
          })
        )
      }

      const responses = await Promise.all(requests)
      if (responses.some((r) => !r.ok)) throw new Error("Save failed")

      loadedSkillsSig.current = skillsSig(skills)
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("About section saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving(false)
    }
  }

  if (aboutLoading || skillsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-zinc-200" />
        <div className="h-64 rounded-lg bg-zinc-200/60" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card
        title="Bio / Description"
        description="This is the short story visitors read about you. Updated to reflect 4+ years of experience (2022 — present)."
      >
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Write about yourself..."
        />
      </Card>

      <Card
        title={`Core Skills (${skills.length})`}
        description="Each skill renders as a progress bar on the About section."
      >
        <div className="space-y-3">
          {skills.map((skill, i) => (
            <div key={skill.id || i} className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center">
              <input
                value={skill.name}
                onChange={(e) => updateSkill(i, "name", e.target.value)}
                placeholder="Skill name"
                className="w-full flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-200">
                  {(() => { const Ic = ICON_MAP[skill.icon] || Code; return <Ic className="h-4 w-4 text-zinc-900" /> })()}
                </span>
                <select
                  value={skill.icon}
                  onChange={(e) => updateSkill(i, "icon", e.target.value)}
                  className="w-36 rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
                >
                  {ICON_OPTIONS.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-2 sm:w-44">
                <input
                  type="range" min="0" max="100"
                  value={skill.level}
                  onChange={(e) => updateSkill(i, "level", Number(e.target.value))}
                  className="flex-1 accent-zinc-900"
                />
                <span className="w-10 shrink-0 text-right text-xs font-semibold text-zinc-700">{skill.level}%</span>
              </div>
              <IconButton label="Remove skill" tone="danger" onClick={() => removeSkill(i)}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-zinc-400">No skills yet. Add your first one below.</p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <Field label="New Skill">
              <input
                value={newSkill.name}
                onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Skill name"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
            </Field>
          </div>
          <Button variant="secondary" onClick={addSkill}>
            <Plus className="h-4 w-4" /> Add Skill
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save About Section"}
        </Button>
      </div>
    </div>
  )
}