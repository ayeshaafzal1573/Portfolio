"use client"

import { useState, useEffect } from "react"
import { useSiteSettings } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Settings } from "lucide-react"

export default function SiteEditor() {
  const { data: settingsData, loading } = useSiteSettings()
  const [brandName, setBrandName] = useState("")
  const [footerText, setFooterText] = useState("")

  useEffect(() => {
    if (settingsData) {
      setBrandName(settingsData.brand_name || "")
      setFooterText(settingsData.footer_text || "")
    }
  }, [settingsData])

  const handleSave = async () => {
    try {
      await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, footer_text: footerText }),
      })
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Site settings saved!", "success")
    } catch {
      showToast("Failed to save", "error")
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
          <Settings className="h-6 w-6 text-[color:var(--accent-primary)]" />
          Site Settings
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Edit the navigation bar and footer.</p>
      </div>

      <div className="space-y-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Navigation Bar</label>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Brand Name</label>
          <p className="mb-2 text-[11px] text-[color:var(--text-secondary)]">Shown at the top-left of the navigation bar.</p>
          <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Ayesha." className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
          <div className="mt-3 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-sora font-semibold text-[color:var(--text-primary)]">{brandName || "Ayesha."}</span>
              <div className="flex gap-4 text-xs text-[color:var(--text-secondary)]">
                <span>Home</span><span>About</span><span>Projects</span><span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">Footer</label>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[color:var(--text-primary)]">Copyright Text</label>
          <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="© 2026 Ayesha Afzal..." className="input-shell w-full rounded-xl px-4 py-3 text-sm" />
          <div className="mt-3 rounded-xl border-t border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-3 text-center">
            <p className="text-xs text-[color:var(--text-secondary)]">{footerText || "© 2026 Ayesha Afzal. Crafting digital experiences with passion."}</p>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]">
        Save Site Settings
      </button>
    </div>
  )
}
