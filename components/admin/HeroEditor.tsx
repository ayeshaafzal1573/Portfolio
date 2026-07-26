"use client"

import { useState, useEffect } from "react"
import { useProfile, useTypingRoles } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { ImageIcon, Plus, X, Eye } from "lucide-react"

export default function HeroEditor() {
  const { data: profile, loading: profileLoading } = useProfile()
  const { data: rolesData, loading: rolesLoading } = useTypingRoles()
  const [name, setName] = useState("")
  const [introLabel, setIntroLabel] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")
  const [ctaText, setCtaText] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [newRole, setNewRole] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || "")
      setIntroLabel(profile.intro_label || "")
      setSubtitle(profile.subtitle || "")
      setDescription(profile.description || "")
      setCtaText(profile.cta_text || "")
      setProfileImage(profile.profile_image || "")
    }
  }, [profile])

  useEffect(() => {
    if (rolesData) setRoles(rolesData.map((r) => r.role))
  }, [rolesData])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfileImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const addRole = () => {
    const trimmed = newRole.trim()
    if (!trimmed) return
    setRoles((prev) => [...prev, trimmed])
    setNewRole("")
  }

  const removeRole = (index: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Name is required", "error")
      return
    }
    try {
      await Promise.all([
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, intro_label: introLabel, subtitle, description, cta_text: ctaText, profile_image: profileImage }),
        }),
        fetch("/api/typing-roles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roles }),
        }),
      ])
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Hero section saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  if (profileLoading || rolesLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-[color:var(--accent-primary)]" />
            Hero Section
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
            Edit the headline, roles, description, and images.
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="btn-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Hide" : "Show"} Preview
        </button>
      </div>

      <div className="space-y-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Identity</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Full Name <span className="text-red-400">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ayesha Afzal" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Intro Label</label>
            <input type="text" value={introLabel} onChange={(e) => setIntroLabel(e.target.value)} placeholder="Hi, My Name Is" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Subtitle / Tagline</label>
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Full-Stack Software Engineer" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A brief paragraph about your expertise..." className="input-shell w-full resize-none rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">CTA Button Text</label>
          <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Let's Build Together" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Typing Animation Roles</label>
        <p className="mb-3 text-[11px] text-[color:var(--text-secondary)]">These cycle in the hero with a typewriter effect.</p>
        <div className="space-y-2">
          {roles.map((role, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] px-3 py-2">
              <span className="flex-1 text-sm text-[color:var(--text-primary)]">{role}</span>
              <button onClick={() => removeRole(i)} className="shrink-0 rounded-md p-1 text-red-400 hover:bg-red-500/10 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())} placeholder="e.g. MERN Stack Specialist" className="input-shell flex-1 rounded-lg px-3 py-2 text-sm" />
          <button onClick={addRole} className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Profile Photo</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-[color:var(--text-secondary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--text-primary)] hover:file:bg-[color:var(--accent-primary)] hover:file:text-white file:transition-colors file:cursor-pointer" />
        {profileImage && (
          <img src={profileImage} alt="Profile preview" className="mt-3 h-32 w-24 rounded-xl border border-[color:var(--card-border)] object-cover shadow-sm" />
        )}
      </div>

      {showPreview && (
        <div>
          <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Preview</label>
          <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-6 overflow-hidden">
            <div className="flex items-start gap-6">
              {profileImage && <img src={profileImage} alt="Preview" className="h-24 w-20 shrink-0 rounded-xl object-cover shadow-md" />}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent-primary)]">{introLabel || "Hi, My Name Is"}</p>
                <h3 className="font-sora text-2xl font-extrabold text-[color:var(--text-primary)]">{name || "Your Name"}</h3>
                <p className="text-sm font-bold text-[color:var(--accent-secondary)]">{roles[0] || "Your Role"}</p>
                <p className="text-xs text-[color:var(--text-secondary)] line-clamp-2">{description || "Your description..."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={handleSave} className="btn-primary rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]">
        Save Hero Section
      </button>
    </div>
  )
}
