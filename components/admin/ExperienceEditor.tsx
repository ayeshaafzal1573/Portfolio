"use client"

import { useState, useEffect } from "react"
import { useTimelineEntries } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Plus, X, ChevronDown, ChevronUp, GripVertical, Briefcase, Save } from "lucide-react"
import { Button, IconButton, Card, Field, TextField, TextArea } from "@/components/admin/ui"

export default function ExperienceEditor() {
  const { data: entriesData, loading } = useTimelineEntries()
  const [entries, setEntries] = useState<any[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (entriesData) setEntries(entriesData.map((e) => ({ ...e })))
  }, [entriesData])

  const addEntry = () => {
    const newEntry = {
      id: `new-${Date.now()}`,
      year: "",
      title: "",
      description: "",
      skills: [],
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

  const addSkill = (index: number) => {
    if (!newSkill.trim()) return
    const entry = entries[index]
    updateEntry(index, "skills", [...(entry.skills || []), newSkill.trim()])
    setNewSkill("")
  }

  const removeSkill = (entryIndex: number, skillIndex: number) => {
    const entry = entries[entryIndex]
    updateEntry(entryIndex, "skills", entry.skills.filter((_: string, i: number) => i !== skillIndex))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: entries.map((e) => ({ ...e, id: undefined })) }),
      })
      if (!response.ok) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Experience saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
        title="Experience Timeline"
        description="Manage your professional journey. Entries appear chronologically on the site — the more years, the stronger the story (2022 to present)."
        actions={
          <Button variant="secondary" onClick={addEntry} icon={<Plus className="h-4 w-4" />}>
            Add Entry
          </Button>
        }
      >
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={entry.id || i} className="overflow-hidden rounded-lg border border-zinc-200">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpanded(expanded === i ? null : i)}
                onKeyDown={(e) => e.key === "Enter" && setExpanded(expanded === i ? null : i)}
                className="flex w-full cursor-pointer items-center gap-3 bg-zinc-50 p-4 text-left"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="inline-flex shrink-0 items-center rounded-sm border border-zinc-300 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700">
                  {entry.year || "—"}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">
                  {entry.title || "Untitled entry"}
                </span>
                <IconButton label="Remove entry" tone="danger" onClick={(e) => { e.stopPropagation(); removeEntry(i) }}>
                  <X className="h-4 w-4" />
                </IconButton>
                {expanded === i ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                )}
              </div>
              {expanded === i && (
                <div className="space-y-4 border-t border-zinc-200 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Year" hint="e.g. 2023 — 2024">
                      <TextField
                        value={entry.year}
                        onChange={(e) => updateEntry(i, "year", e.target.value)}
                        placeholder="2023 — 2024"
                      />
                    </Field>
                    <Field label="Title" hint="Role or milestone">
                      <TextField
                        value={entry.title}
                        onChange={(e) => updateEntry(i, "title", e.target.value)}
                        placeholder="Senior Software Engineer"
                      />
                    </Field>
                  </div>
                  <Field label="Description" hint="What did you achieve here?">
                    <TextArea
                      value={entry.description}
                      onChange={(e) => updateEntry(i, "description", e.target.value)}
                      rows={3}
                      placeholder="Describe the role, company and impact..."
                    />
                  </Field>
                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-zinc-900">Skills</span>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {(entry.skills || []).map((skill: string, si: number) => (
                        <span key={si} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800">
                          {skill}
                          <button onClick={() => removeSkill(i, si)} className="text-zinc-400 hover:text-zinc-900" aria-label={`Remove ${skill}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {entry.skills?.length === 0 && (
                        <span className="text-xs text-zinc-400">No skills added yet.</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <TextField
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(i))}
                        placeholder="Add a skill and press Enter"
                        className="max-w-xs"
                      />
                      <Button variant="secondary" onClick={() => addSkill(i)}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 py-14 text-center">
              <Briefcase className="mb-3 h-10 w-10 text-zinc-300" />
              <p className="text-sm font-semibold text-zinc-900">No experience entries yet</p>
              <p className="mt-1 text-sm text-zinc-500">Add your first milestone to start building your timeline.</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save Experience"}
        </Button>
      </div>
    </div>
  )
}