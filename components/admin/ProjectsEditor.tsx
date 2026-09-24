"use client"

import { useEffect, useState } from "react"
import { Modal } from "@/components/admin/Modal"
import { useCategorizedProjects } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Film,
  Save,
  FolderKanban,
} from "lucide-react"
import {
  Button,
  IconButton,
  Badge,
  Toggle,
  TextField,
  TextArea,
  SelectField,
  Field,
  EmptyState,
  ConfirmDialog,
} from "@/components/admin/ui"

const CATEGORIES = ["MERN Stack", "Full-Stack", "Mobile Apps", "UI/UX Designs", "Web Development"]

const emptyProject = {
  title: "",
  description: "",
  category: "Full-Stack",
  tech_stack: [],
  demo_url: "",
  github_url: "",
  image_url: "",
  video_url: "",
  is_featured: true,
}

export default function ProjectsEditor() {
  const { data: projectsData, loading } = useCategorizedProjects()
  const [projects, setProjects] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [newTech, setNewTech] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (projectsData) setProjects(projectsData)
  }, [projectsData])

  const openEditor = (project?: any) => {
    setEditing(project ? { ...project } : { ...emptyProject })
    setIsOpen(true)
  }

  const closeEditor = () => {
    setEditing(null)
    setIsOpen(false)
  }

  const handleSave = async () => {
    if (!editing?.title?.trim()) {
      showToast("Title is required", "error")
      return
    }
    setSaving(true)
    try {
      const method = editing.id ? "PUT" : "POST"
      const response = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      if (!response.ok) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      closeEditor()
      showToast("Project saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Delete failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      setDeleteTarget(null)
      showToast("Project deleted", "info")
    } catch {
      showToast("Failed to delete", "error")
    }
  }

  const addTech = () => {
    if (!newTech.trim()) return
    setEditing({ ...editing, tech_stack: [...(editing.tech_stack || []), newTech.trim()] })
    setNewTech("")
  }

  const removeTech = (index: number) => {
    setEditing({ ...editing, tech_stack: editing.tech_stack.filter((_: string, i: number) => i !== index) })
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {projects.length} project{projects.length !== 1 ? "s" : ""} total.
        </p>
        <Button onClick={() => openEditor()} icon={<Plus className="h-4 w-4" />}>
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="No projects yet"
          description='Click "Add Project" to showcase your work.'
          action={<Button onClick={() => openEditor()} icon={<Plus className="h-4 w-4" />}>Add Project</Button>}
        />
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-200">
                {proj.video_url ? (
                  <video src={proj.video_url} className="h-full w-full object-cover" muted />
                ) : proj.image_url ? (
                  <img src={proj.image_url} alt={proj.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                    <ImageIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-zinc-900">{proj.title}</p>
                  {proj.is_featured && <Badge tone="dark">Featured</Badge>}
                </div>
                <p className="truncate text-xs text-zinc-500">{proj.category}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconButton label="Edit" onClick={() => openEditor(proj)}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton label="Delete" tone="danger" onClick={() => setDeleteTarget(proj)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={closeEditor} size="lg" title={editing?.id ? "Edit Project" : "Add Project"}>
        {editing && (
          <div className="space-y-4">
            <Field label="Title" required>
              <TextField value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Project title" />
            </Field>

            <Field label="Description">
              <TextArea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} placeholder="Project description" />
            </Field>

            <Field label="Category">
              <SelectField value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </SelectField>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Demo URL">
                <TextField value={editing.demo_url} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} placeholder="https://..." />
              </Field>
              <Field label="GitHub URL">
                <TextField value={editing.github_url} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} placeholder="https://..." />
              </Field>
            </div>

            <Field label="Project Image" hint="Choose a file or paste a URL below.">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition-colors hover:border-zinc-900">
                <Upload className="h-5 w-5 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700">Choose image or paste URL</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setEditing({ ...editing, image_url: reader.result as string })
                  reader.readAsDataURL(file)
                }} />
              </label>
              {editing.image_url && (
                <div className="relative mt-3">
                  <img src={editing.image_url} alt="Preview" className="h-40 w-full rounded-md border border-zinc-200 object-cover shadow-sm" />
                  <button onClick={() => setEditing({ ...editing, image_url: "" })} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80" aria-label="Remove image">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <TextField
                value={editing.image_url.startsWith("data:") ? "" : editing.image_url}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                placeholder="Or paste image URL here..."
                className="mt-2"
              />
            </Field>

            <Field label="Project Video">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition-colors hover:border-zinc-900">
                <Film className="h-5 w-5 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700">Choose video or paste URL</span>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setEditing({ ...editing, video_url: reader.result as string })
                  reader.readAsDataURL(file)
                }} />
              </label>
              {editing.video_url && (
                <div className="relative mt-3">
                  <video src={editing.video_url} className="h-40 w-full rounded-md border border-zinc-200 object-cover shadow-sm" muted controls />
                  <button onClick={() => setEditing({ ...editing, video_url: "" })} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80" aria-label="Remove video">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <TextField
                value={editing.video_url.startsWith("data:") ? "" : editing.video_url}
                onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
                placeholder="Or paste video URL here..."
                className="mt-2"
              />
            </Field>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-zinc-900">Tech Stack</span>
              <div className="mb-2 flex flex-wrap gap-2">
                {(editing.tech_stack || []).map((tech: string, ti: number) => (
                  <span key={ti} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800">
                    {tech}
                    <button onClick={() => removeTech(ti)} className="text-zinc-400 hover:text-zinc-900" aria-label={`Remove ${tech}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {editing.tech_stack?.length === 0 && (
                  <span className="text-xs text-zinc-400">No tech added yet.</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <TextField
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  placeholder="Add tech and press Enter"
                  className="max-w-xs"
                />
                <Button variant="secondary" onClick={addTech}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Featured Project</p>
                <p className="text-xs text-zinc-500">Featured projects stand out on your landing page.</p>
              </div>
              <Toggle checked={!!editing.is_featured} onChange={(v) => setEditing({ ...editing, is_featured: v })} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={closeEditor}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
                {saving ? "Saving…" : "Save Project"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        message={`This will permanently remove "${deleteTarget?.title}" from your portfolio. This cannot be undone.`}
        onConfirm={() => deleteTarget && deleteProject(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}