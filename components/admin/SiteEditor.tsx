"use client"

import { useState, useEffect } from "react"
import { useSiteSettings } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Save } from "lucide-react"
import { Button, Card, Field, TextField } from "@/components/admin/ui"

export default function SiteEditor() {
  const { data: settingsData, loading } = useSiteSettings()
  const [brandName, setBrandName] = useState("")
  const [footerText, setFooterText] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settingsData) {
      setBrandName(settingsData.brand_name || "")
      setFooterText(settingsData.footer_text || "")
    }
  }, [settingsData])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, footer_text: footerText }),
      })
      if (!response.ok) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Site settings saved!", "success")
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
      <Card title="Navigation Bar" description="The top bar of your portfolio site.">
        <Field label="Brand Name" hint="Shown at the top-left of the navigation bar.">
          <TextField value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Ayesha." />
        </Field>
        <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-zinc-900">{brandName || "Ayesha."}</span>
            <div className="flex gap-4 text-xs text-zinc-500">
              <span>Home</span><span>About</span><span>Projects</span><span>Contact</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Footer" description="The copyright line at the bottom of your site.">
        <Field label="Copyright Text">
          <TextField value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="© 2026 Ayesha Afzal. Crafting digital experiences with passion." />
        </Field>
        <div className="mt-4 rounded-md border-t border-zinc-200 bg-zinc-50 p-3 text-center">
          <p className="text-xs text-zinc-500">{footerText || "© 2026 Ayesha Afzal. Crafting digital experiences with passion."}</p>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save Site Settings"}
        </Button>
      </div>
    </div>
  )
}