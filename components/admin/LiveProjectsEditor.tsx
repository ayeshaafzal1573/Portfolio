"use client"

import { useEffect, useState } from "react"
import { useLiveProjects } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Modal } from "@/components/admin/Modal"
import {
  Plus,
  Pencil,
  Trash2,
  Play,
  ExternalLink,
  X,
  Upload,
  Save,
} from "lucide-react"
import {
  Button,
  IconButton,
  TextField,
  Field,
  EmptyState,
  ConfirmDialog,
} from "@/components/admin/ui"

const emptyProject = { name: "", thumbnail_url: "", live_url: "" }

export default function LiveProjectsEditor() {
  const { data: projectsData, loading } = useLiveProjects()
  const [projects, setProjects] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
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
    if (!editing?.name?.trim() || !editing?.live_url?.trim()) {
      showToast("Name and URL are required", "error")
      return
    }
    setSaving(true)
    try {
      const method = editing.id ? "PUT" : "POST"
      let response: Response
      if (method === "POST") {
        response = await fetch("/api/live-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editing, sort_order: projects.length }),
        })
      } else {
        const updated = projects.map((p) => (p.id === editing.id ? editing : p))
        response = await fetch("/api/live-projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: updated.map((p, i) => ({ ...p, sort_order: i })) }),
        })
      }
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
      const response = await fetch(`/api/live-projects?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Delete failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      setDeleteTarget(null)
      showToast("Deleted", "info")
    } catch {
      showToast("Failed to delete", "error")
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {projects.length} project{projects.length !== 1 ? "s" : ""} in production.
        </p>
        <Button onClick={() => openEditor()} icon={<Plus className="h-4 w-4" />}>
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<Play className="h-6 w-6" />}
          title="No live projects yet"
          description="Add apps that are currently running in production."
          action={<Button onClick={() => openEditor()} icon={<Plus className="h-4 w-4" />}>Add Project</Button>}
        />
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-200">
                {proj.thumbnail_url ? (
                  <img src={proj.thumbnail_url} alt={proj.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                    <Play className="h-5 w-5 text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900">{proj.name}</p>
                <a href={proj.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 truncate text-xs text-zinc-500 hover:text-zinc-900">
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {proj.live_url}
                </a>
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

      <Modal isOpen={isOpen} onClose={closeEditor} size="sm" title={editing?.id ? "Edit Live Project" : "Add Live Project"}>
        {editing && (
          <div className="space-y-4">
            <Field label="Name" required>
              <TextField value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Project name" />
            </Field>

            <Field label="Thumbnail" hint="Choose a file or paste a URL below.">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition-colors hover:border-zinc-900">
                <Upload className="h-5 w-5 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700">Choose image or paste URL</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setEditing({ ...editing, thumbnail_url: reader.result as string })
                  reader.readAsDataURL(file)
                }} />
              </label>
              {editing.thumbnail_url && (
                <div className="relative mt-3">
                  <img src={editing.thumbnail_url} alt="Preview" className="h-36 w-full rounded-md border border-zinc-200 object-cover shadow-sm" />
                  <button onClick={() => setEditing({ ...editing, thumbnail_url: "" })} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80" aria-label="Remove thumbnail">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <TextField
                value={editing.thumbnail_url.startsWith("data:") ? "" : editing.thumbnail_url}
                onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })}
                placeholder="Or paste thumbnail URL here..."
                className="mt-2"
              />
            </Field>

            <Field label="Live URL" required>
              <TextField value={editing.live_url} onChange={(e) => setEditing({ ...editing, live_url: e.target.value })} placeholder="https://..." />
            </Field>

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
        title="Delete live project?"
        message={`This will permanently remove "${deleteTarget?.name}" from your site. This cannot be undone.`}
        onConfirm={() => deleteTarget && deleteProject(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}