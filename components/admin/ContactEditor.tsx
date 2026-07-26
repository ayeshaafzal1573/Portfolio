"use client"

import { useState, useEffect } from "react"
import { useContactInfo, useSocialLinks } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Mail, Plus, X } from "lucide-react"

const PLATFORM_OPTIONS = ["github", "linkedin", "behance", "dribbble", "twitter", "youtube", "instagram", "website"]

export default function ContactEditor() {
  const { data: contactData, loading: contactLoading } = useContactInfo()
  const { data: linksData, loading: linksLoading } = useSocialLinks()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [heading, setHeading] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [socialLinks, setSocialLinks] = useState<any[]>([])

  useEffect(() => {
    if (contactData) {
      setEmail(contactData.email || "")
      setPhone(contactData.phone || "")
      setHeading(contactData.heading || "")
      setSubtitle(contactData.subtitle || "")
      setResumeUrl(contactData.resume_url || "")
    }
  }, [contactData])

  useEffect(() => {
    if (linksData) setSocialLinks(linksData.map((l) => ({ platform: l.platform, url: l.url, label: l.label })))
  }, [linksData])

  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, { platform: "github", url: "", label: "" }])
  }

  const updateSocialLink = (index: number, field: string, value: string) => {
    setSocialLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      await Promise.all([
        fetch("/api/contact-info", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone, heading, subtitle, resume_url: resumeUrl }),
        }),
        fetch("/api/social-links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ links: socialLinks }),
        }),
      ])
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Contact section saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  if (contactLoading || linksLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
          <Mail className="h-6 w-6 text-[color:var(--accent-primary)]" />
          Contact Section
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Edit contact details and social links.</p>
      </div>

      <div className="space-y-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Contact Details</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 1234567" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Section Text</label>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Heading</label>
          <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Let's Work Together" className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Subtitle</label>
          <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} placeholder="Ready to bring your ideas to life?..." className="input-shell w-full resize-none rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Resume URL</label>
          <input type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://drive.google.com/..." className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Social Links ({socialLinks.length})</label>
          <button onClick={addSocialLink} className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold">
            <Plus className="h-3.5 w-3.5" /> Add Link
          </button>
        </div>
        <div className="space-y-3">
          {socialLinks.map((link, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-4 sm:flex-row sm:items-center">
              <select value={link.platform} onChange={(e) => updateSocialLink(i, "platform", e.target.value)} className="input-shell rounded-lg px-3 py-2 text-sm capitalize w-36 shrink-0">
                {PLATFORM_OPTIONS.map((p) => (<option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>))}
              </select>
              <input value={link.url} onChange={(e) => updateSocialLink(i, "url", e.target.value)} placeholder="https://..." className="input-shell flex-1 rounded-lg px-3 py-2 text-sm" />
              <input value={link.label} onChange={(e) => updateSocialLink(i, "label", e.target.value)} placeholder="Label" className="input-shell rounded-lg px-3 py-2 text-sm w-28 shrink-0" />
              <button onClick={() => removeSocialLink(i)} className="shrink-0 rounded-md p-1.5 text-red-400 hover:bg-red-500/10">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]">
        Save Contact Section
      </button>
    </div>
  )
}
