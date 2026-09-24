"use client"

import { useState, useEffect } from "react"
import { showToast } from "@/components/admin/Toast"
import { Save, Palette, Check } from "lucide-react"
import {
  Button,
  Card,
  Field,
  SelectField,
  EmptyState,
} from "@/components/admin/ui"
import {
  DEFAULT_CONFIG,
  type ThemeConfig,
  type ThemeMode,
  type ThemePalette,
} from "@/lib/theme"

const PALETTE_FIELDS: { key: keyof ThemePalette; label: string }[] = [
  { key: "backgroundColor", label: "Background" },
  { key: "textColor", label: "Text" },
  { key: "primaryColor", label: "Primary / Buttons" },
  { key: "secondaryColor", label: "Secondary text" },
  { key: "accentColor", label: "Accent" },
]

const MODE_LABEL: Record<ThemeMode, string> = {
  dark: "Dark",
  light: "Light",
  warm: "Warm",
}

export default function ThemeEditor() {
  const [config, setConfig] = useState<ThemeConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeMode, setActiveMode] = useState<ThemeMode>("dark")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/theme-config")
        const data = await res.json()
        setConfig(data.config || DEFAULT_CONFIG)
      } catch {
        setConfig(DEFAULT_CONFIG)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const updatePalette = (mode: ThemeMode, key: keyof ThemePalette, value: string) => {
    if (!config) return
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            modes: { ...prev.modes, [mode]: { ...prev.modes[mode], [key]: value } },
          }
        : prev
    )
  }

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch("/api/theme-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      })
      if (!res.ok) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Theme saved — site now reflects it", "success")
    } catch {
      showToast("Failed to save theme", "error")
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

  if (!config) {
    return (
      <EmptyState
        icon={<Palette className="h-5 w-5" />}
        title="Couldn't load theme config"
        description="Refresh the page to try again."
      />
    )
  }

  const activePalette = config.modes[activeMode]

  return (
    <div className="space-y-6">
      <Card
        title="Theme & Color Modes"
        description="Customize the three site modes — dark, light and warm. Visitors can switch between them from the navbar."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
            {(Object.keys(config.modes) as ThemeMode[]).map((mode) => {
              const isActive = activeMode === mode
              return (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-700 hover:text-zinc-900"
                  }`}
                >
                  {isActive && <Check className="h-3.5 w-3.5" />}
                  {MODE_LABEL[mode]} Mode
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PALETTE_FIELDS.map((field) => (
              <div key={field.key} className="rounded-lg border border-zinc-200 p-4">
                <span className="mb-2 block text-sm font-medium text-zinc-900">{field.label}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activePalette[field.key]}
                    onChange={(e) => updatePalette(activeMode, field.key, e.target.value)}
                    className="h-10 w-14 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-0.5"
                    aria-label={`${MODE_LABEL[activeMode]} ${field.label}`}
                  />
                  <input
                    type="text"
                    value={activePalette[field.key]}
                    onChange={(e) => updatePalette(activeMode, field.key, e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs uppercase text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  />
                </div>
              </div>
            ))}
          </div>

          <Field label="Default mode" hint="Which mode the site opens in for visitors.">
            <SelectField
              value={config.default}
              onChange={(e) =>
                setConfig((prev) => (prev ? { ...prev, default: e.target.value as ThemeMode } : prev))
              }
              className="max-w-xs"
            >
              {(Object.keys(config.modes) as ThemeMode[]).map((mode) => (
                <option key={mode} value={mode}>
                  {MODE_LABEL[mode]}
                </option>
              ))}
            </SelectField>
          </Field>

          <div>
            <span className="mb-2 block text-sm font-medium text-zinc-900">Preview</span>
            <div
              className="rounded-lg border border-zinc-200 p-6"
              style={{
                background: activePalette.backgroundColor,
                color: activePalette.textColor,
              }}
            >
              <p className="text-lg font-semibold" style={{ color: activePalette.primaryColor }}>
                Preview heading
              </p>
              <p className="mt-1 text-sm" style={{ color: activePalette.secondaryColor }}>
                Supporting text in the {MODE_LABEL[activeMode]} mode.
              </p>
              <span
                className="mt-3 inline-block rounded-md px-3 py-1.5 text-sm font-medium"
                style={{ background: activePalette.primaryColor, color: activePalette.textColor }}
              >
                A button
              </span>{" "}
              <span className="mt-3 inline-block rounded-md px-3 py-1.5 text-sm font-medium text-white" style={{ background: activePalette.accentColor }}>
                Accent
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save Theme"}
        </Button>
      </div>
    </div>
  )
}