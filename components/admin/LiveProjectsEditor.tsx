"use client"

import { useEffect, useState } from "react"
import { useLiveProjects } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Modal } from "@/components/admin/Modal"
import { Plus, Pencil, Trash2, Play, ExternalLink, X, Upload } from "lucide-react"

const emptyProject = { name: "", thumbnail_url: "", live_url: "" }

export default function LiveProjectsEditor() {
  const { data: projectsData, loading } = useLiveProjects()
  const [projects, setProjects] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (projectsData) setProjects(projectsData)
  }, [projectsData])

  const openEditor = (project?: any) => {
    setEditing(project ? { ...project } : { ...emptyProject })
    setIsOpen(true)
  }

  const closeEditor = () => { setEditing(null); setIsOpen(false) }

  const handleSave = async () => {
    if (!editing?.name?.trim() || !editing?.live_url?.trim()) {
      showToast("Name and URL are required", "error")
      return
    }
    try {
      const method = editing.id ? "PUT" : "POST"
      if (method === "POST") {
        await fetch("/api/live-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editing, sort_order: projects.length }),
        })
      } else {
        const updated = projects.map((p) => (p.id === editing.id ? editing : p))
        await fetch("/api/live-projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: updated.map((p, i) => ({ ...p, sort_order: i })) }),
        })
      }
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      closeEditor()
      showToast("Project saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/live-projects?id=${id}`, { method: "DELETE" })
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Deleted", "info")
    } catch {
      showToast("Failed to delete", "error")
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
            <Play className="h-6 w-6 text-[color:var(--accent-primary)]" />
            Live Projects
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{projects.length} project{projects.length !== 1 ? "s" : ""} in production.</p>
        </div>
        <button onClick={() => openEditor()} className="btn-primary shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="flex items-center gap-4 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-3 shadow-sm hover:shadow-md transition-all">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[color:var(--card-border)]">
              {proj.thumbnail_url ? (
                <img src={proj.thumbnail_url} alt={proj.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[color:var(--accent-soft)]">
                  <Play className="h-5 w-5 text-[color:var(--text-secondary)]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[color:var(--text-primary)] truncate">{proj.name}</p>
              <p className="text-[11px] text-[color:var(--text-secondary)] truncate">{proj.live_url}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditor(proj)} className="rounded-lg p-2 text-[color:var(--text-secondary)] hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent-primary)]">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => deleteProject(proj.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={closeEditor} title={editing?.id ? "Edit Live Project" : "Add Live Project"}>
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Name <span className="text-red-400">*</span></label>
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-shell w-full rounded-xl px-4 py-3 text-sm" placeholder="Project name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Thumbnail</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--card-border)] bg-[color:var(--accent-soft)] px-4 py-4 text-center transition-colors hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)]/5">
                <Upload className="h-5 w-5 text-[color:var(--text-secondary)]" />
                <span className="text-sm font-semibold text-[color:var(--text-primary)]">Choose image or paste URL</span>
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
                  <img src={editing.thumbnail_url} alt="Preview" className="h-36 w-full rounded-xl border border-[color:var(--card-border)] object-cover shadow-sm" />
                  <button onClick={() => setEditing({ ...editing, thumbnail_url: "" })} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <input value={editing.thumbnail_url.startsWith("data:") ? "" : editing.thumbnail_url} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} className="input-shell mt-2 w-full rounded-xl px-4 py-2.5 text-xs" placeholder="Or paste thumbnail URL here..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Live URL <span className="text-red-400">*</span></label>
              <input value={editing.live_url} onChange={(e) => setEditing({ ...editing, live_url: e.target.value })} className="input-shell w-full rounded-xl px-4 py-3 text-sm" placeholder="https://..." />
            </div>
            <button onClick={handleSave} className="btn-primary w-full rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]">
              Save Project
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
