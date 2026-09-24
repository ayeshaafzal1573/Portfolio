"use client"

import { useState, useEffect } from "react"
import { useProfile, useTypingRoles } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Plus, X, Eye, Save } from "lucide-react"
import { Button, IconButton, Field, TextField, TextArea, Badge } from "@/components/admin/ui"

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
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    try {
      const responses = await Promise.all([
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
      if (responses.some((r) => !r.ok)) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Hero section saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading || rolesLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-zinc-200" />
        <div className="h-64 rounded-lg bg-zinc-200/60" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Identity</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Name, headline and the text shown at the top of your page.</p>
          </div>
          <Button variant="secondary" onClick={() => setShowPreview(!showPreview)} icon={<Eye className="h-4 w-4" />}>
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
        </header>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="Ayesha Afzal" />
            </Field>
            <Field label="Intro Label" hint="Replaces the default 'Hi, My Name Is'">
              <TextField value={introLabel} onChange={(e) => setIntroLabel(e.target.value)} placeholder="Hi, My Name Is" />
            </Field>
          </div>
          <Field label="Subtitle / Tagline">
            <TextField value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Full-Stack Software Engineer" />
          </Field>
          <Field label="Description">
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A brief paragraph about your expertise..." />
          </Field>
          <Field label="CTA Button Text">
            <TextField value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Let's Build Together" />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-900">Typing Animation Roles</h2>
          <p className="mt-0.5 text-sm text-zinc-500">These cycle in the hero with a typewriter effect.</p>
        </header>
        <div className="space-y-2 p-5">
          {roles.map((role, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="flex-1 truncate text-sm text-zinc-900">{role}</span>
              <IconButton label={`Remove ${role}`} tone="danger" onClick={() => removeRole(i)}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
          {roles.length === 0 && <p className="text-sm text-zinc-400">No roles yet. Add one below.</p>}
          <div className="flex items-end gap-2">
            <div className="w-full max-w-sm">
              <TextField
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                placeholder="e.g. MERN Stack Specialist"
              />
            </div>
            <Button variant="secondary" onClick={addRole}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-900">Profile Photo</h2>
          <p className="mt-0.5 text-sm text-zinc-500">Upload a photo or paste an image URL.</p>
        </header>
        <div className="space-y-4 p-5">
          <TextField value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://... or upload below" />
          <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center transition-colors hover:border-zinc-900">
            <span className="text-sm font-medium text-zinc-700">Choose an image file</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {profileImage && (
            <img src={profileImage} alt="Profile preview" className="h-32 w-24 rounded-md border border-zinc-200 object-cover shadow-sm" />
          )}
        </div>
      </section>

      {showPreview && (
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Preview</p>
          <div className="flex items-start gap-6 rounded-md border border-zinc-200 bg-zinc-50 p-6">
            {profileImage && <img src={profileImage} alt="Preview" className="h-24 w-20 shrink-0 rounded-md object-cover shadow" />}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">{introLabel || "Hi, My Name Is"}</p>
              <h3 className="text-2xl font-extrabold text-zinc-900">{name || "Your Name"}</h3>
              <p className="text-sm font-bold text-zinc-700">{roles[0] || "Your Role"}</p>
              <p className="line-clamp-2 text-xs text-zinc-500">{description || "Your description..."}</p>
              <Badge tone="dark">{ctaText || "Let's Build Together"}</Badge>
            </div>
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save Hero Section"}
        </Button>
      </div>
    </div>
  )
}