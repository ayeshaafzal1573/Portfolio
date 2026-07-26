"use client"

import React, { useEffect, useState, useRef } from "react"
import { Modal } from "@/components/admin/Modal"
import { useCategorizedProjects } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Plus, GripVertical, Pencil, Trash2, Image as ImageIcon, Upload, X, Film } from "lucide-react"

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
  const [newTech, setNewTech] = useState("")

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
    try {
      const method = editing.id ? "PUT" : "POST"
      await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      closeEditor()
      showToast("Project saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
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

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-[color:var(--accent-primary)]" />
            Featured Projects
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total.
          </p>
        </div>
        <button onClick={() => openEditor()} className="btn-primary shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[color:var(--card-border)] py-16 text-center">
          <FolderKanban className="h-12 w-12 text-[color:var(--text-secondary)] opacity-40 mb-4" />
          <p className="text-lg font-bold text-[color:var(--text-primary)]">No projects yet</p>
          <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Click "Add Project" to showcase your work.</p>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="flex items-center gap-4 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-3 shadow-sm hover:shadow-md transition-all">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[color:var(--card-border)]">
              {(proj.image_url || proj.video_url) ? (
                proj.video_url ? (
                  <video src={proj.video_url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={proj.image_url} alt={proj.title} className="h-full w-full object-cover" />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[color:var(--accent-soft)]">
                  <ImageIcon className="h-5 w-5 text-[color:var(--text-secondary)]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[color:var(--text-primary)] truncate">{proj.title}</p>
              <p className="text-[11px] text-[color:var(--text-secondary)] truncate">{proj.category} &middot; {proj.tech_stack?.length || 0} tech</p>
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

      <Modal isOpen={isOpen} onClose={closeEditor} title={editing?.id ? "Edit Project" : "Add Project"}>
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Title <span className="text-red-400">*</span></label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-shell w-full rounded-xl px-4 py-3 text-sm" placeholder="Project title" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Description</label>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="input-shell w-full resize-none rounded-xl px-4 py-3 text-sm" placeholder="Project description" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Category</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input-shell w-full rounded-xl px-4 py-3 text-sm">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Project Image</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--card-border)] bg-[color:var(--accent-soft)] px-4 py-4 text-center transition-colors hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)]/5">
                <Upload className="h-5 w-5 text-[color:var(--text-secondary)]" />
                <span className="text-sm font-semibold text-[color:var(--text-primary)]">Choose image or paste URL</span>
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
                  <img src={editing.image_url} alt="Preview" className="h-40 w-full rounded-xl border border-[color:var(--card-border)] object-cover shadow-sm" />
                  <button onClick={() => setEditing({ ...editing, image_url: "" })} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <input value={editing.image_url.startsWith("data:") ? "" : editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="input-shell mt-2 w-full rounded-xl px-4 py-2.5 text-xs" placeholder="Or paste image URL here..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Demo URL</label>
                <input value={editing.demo_url} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} className="input-shell w-full rounded-xl px-4 py-3 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">GitHub URL</label>
                <input value={editing.github_url} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} className="input-shell w-full rounded-xl px-4 py-3 text-sm" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Project Video</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--card-border)] bg-[color:var(--accent-soft)] px-4 py-4 text-center transition-colors hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)]/5">
                <Film className="h-5 w-5 text-[color:var(--text-secondary)]" />
                <span className="text-sm font-semibold text-[color:var(--text-primary)]">Choose video or paste URL</span>
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
                  <video src={editing.video_url} className="h-40 w-full rounded-xl border border-[color:var(--card-border)] object-cover shadow-sm" muted controls />
                  <button onClick={() => setEditing({ ...editing, video_url: "" })} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <input value={editing.video_url.startsWith("data:") ? "" : editing.video_url} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className="input-shell mt-2 w-full rounded-xl px-4 py-2.5 text-xs" placeholder="Or paste video URL here..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--text-primary)]">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.tech_stack || []).map((tech: string, ti: number) => (
                  <div key={ti} className="flex items-center gap-1 rounded-full chip px-2.5 py-1">
                    <span className="text-xs font-semibold">{tech}</span>
                    <button onClick={() => setEditing({ ...editing, tech_stack: editing.tech_stack.filter((_: string, i: number) => i !== ti) })} className="text-red-400 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newTech} onChange={(e) => setNewTech(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="Add tech" className="input-shell flex-1 rounded-lg px-3 py-2 text-sm" />
                <button onClick={addTech} className="text-xs font-semibold text-[color:var(--accent-primary)] hover:underline">+ Add</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} className="accent-[color:var(--accent-primary)]" />
              <label className="text-sm font-semibold text-[color:var(--text-primary)]">Featured</label>
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
