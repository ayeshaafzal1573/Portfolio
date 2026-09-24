"use client"

import { useState, useEffect } from "react"
import { useContactInfo, useSocialLinks } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Plus, X, Save } from "lucide-react"
import { Button, IconButton, Card, Field, TextField, TextArea, SelectField } from "@/components/admin/ui"

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
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    try {
      const responses = await Promise.all([
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
      if (responses.some((r) => !r.ok)) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Contact section saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving(false)
    }
  }

  if (contactLoading || linksLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-zinc-200" />
        <div className="h-64 rounded-lg bg-zinc-200/60" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card title="Contact Details" description="The email and phone number shown to visitors.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email">
            <TextField type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
          </Field>
          <Field label="Phone">
            <TextField value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 1234567" />
          </Field>
        </div>
      </Card>

      <Card title="Section Text" description="Heading, subtitle and resume link for the contact section.">
        <div className="space-y-4">
          <Field label="Heading">
            <TextField value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Let's Work Together" />
          </Field>
          <Field label="Subtitle">
            <TextArea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} placeholder="Ready to bring your ideas to life?..." />
          </Field>
          <Field label="Resume URL">
            <TextField type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://drive.google.com/..." />
          </Field>
        </div>
      </Card>

      <Card
        title={`Social Links (${socialLinks.length})`}
        description="Platforms visitors can reach you on."
        actions={
          <Button variant="secondary" onClick={addSocialLink} icon={<Plus className="h-4 w-4" />}>
            Add Link
          </Button>
        }
      >
        <div className="space-y-3">
          {socialLinks.map((link, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center">
              <SelectField
                value={link.platform}
                onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                className="w-full shrink-0 capitalize sm:w-36"
              >
                {PLATFORM_OPTIONS.map((p) => (<option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>))}
              </SelectField>
              <input
                value={link.url}
                onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                placeholder="https://..."
                className="w-full flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
              <input
                value={link.label}
                onChange={(e) => updateSocialLink(i, "label", e.target.value)}
                placeholder="Label"
                className="w-full shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none sm:w-28"
              />
              <IconButton label="Remove link" tone="danger" onClick={() => removeSocialLink(i)}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
          {socialLinks.length === 0 && (
            <p className="text-sm text-zinc-400">No social links yet. Click "Add Link" to get started.</p>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save Contact Section"}
        </Button>
      </div>
    </div>
  )
}