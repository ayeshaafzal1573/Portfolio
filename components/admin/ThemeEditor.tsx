"use client"

import { useState, useEffect } from "react"
import { useThemeSettings } from "@/lib/useConfig"
import { showToast } from "@/components/admin/Toast"
import { Palette, Sun, Moon, Sparkles } from "lucide-react"

const COLOR_FIELDS = [
  { key: "primaryColor", label: "Primary Color", description: "Main brand color" },
  { key: "secondaryColor", label: "Secondary Color", description: "Supporting accent" },
  { key: "accentColor", label: "Accent Color", description: "Buttons & highlights" },
  { key: "backgroundColor", label: "Background Color", description: "Page background" },
  { key: "textColor", label: "Text Color", description: "Heading & body text" },
]

type ThemeKey = "pastel" | "dark" | "girly-blue"

const THEME_LABELS: Record<ThemeKey, { label: string; emoji: string }> = {
  pastel: { label: "Pastel (Default)", emoji: "🌸" },
  dark: { label: "Dark Mode", emoji: "🌙" },
  "girly-blue": { label: "Girly Blue", emoji: "💙" },
}

type Preset = { label: string; colors: Record<string, string> }

const PRESETS: Record<ThemeKey, Preset[]> = {
  pastel: [
    {
      label: "Signature Brown",
      colors: { primaryColor: "#b0783e", secondaryColor: "#c68d5c", accentColor: "#a2653c", backgroundColor: "#f6efe4", textColor: "#3b2a1c" },
    },
    {
      label: "Cream Latte",
      colors: { primaryColor: "#c99a63", secondaryColor: "#e0bd8f", accentColor: "#b07c45", backgroundColor: "#fdf8f0", textColor: "#43301f" },
    },
    {
      label: "Espresso",
      colors: { primaryColor: "#8a5a2f", secondaryColor: "#a9743f", accentColor: "#7a4a22", backgroundColor: "#f3e9db", textColor: "#2f1f12" },
    },
  ],
  dark: [
    {
      label: "Monochrome",
      colors: { primaryColor: "#ffffff", secondaryColor: "#d4d4d4", accentColor: "#f5f5f5", backgroundColor: "#050505", textColor: "#f5f5f5" },
    },
    {
      label: "Mocha Night",
      colors: { primaryColor: "#b07c40", secondaryColor: "#c0864a", accentColor: "#d9a25c", backgroundColor: "#1b130c", textColor: "#eee2d0" },
    },
    {
      label: "Cocoa",
      colors: { primaryColor: "#9c6b3a", secondaryColor: "#b4834f", accentColor: "#e0b072", backgroundColor: "#171009", textColor: "#f0e6d6" },
    },
    {
      label: "Caramel",
      colors: { primaryColor: "#c98f4c", secondaryColor: "#dda868", accentColor: "#f0c184", backgroundColor: "#221710", textColor: "#f6ecdd" },
    },
  ],
  "girly-blue": [
    {
      label: "Warm Rose",
      colors: { primaryColor: "#c8864e", secondaryColor: "#d89a67", accentColor: "#b1683b", backgroundColor: "#f9f2e8", textColor: "#472e1d" },
    },
    {
      label: "Blush Mocha",
      colors: { primaryColor: "#cf8f6a", secondaryColor: "#e0a884", accentColor: "#b96f45", backgroundColor: "#fdf3ee", textColor: "#4a2c1d" },
    },
    {
      label: "Honey",
      colors: { primaryColor: "#d9a24a", secondaryColor: "#e6bd74", accentColor: "#c0862f", backgroundColor: "#fbf4e6", textColor: "#463218" },
    },
  ],
}

export default function ThemeEditor() {
  const { data: themeData, loading } = useThemeSettings()
  const [theme, setTheme] = useState<any>(null)
  const [editMode, setEditMode] = useState<ThemeKey>("pastel")

  useEffect(() => {
    if (themeData?.theme) setTheme(themeData.theme)
  }, [themeData])

  const handleChange = (key: string, value: string) => {
    setTheme((prev: any) => ({
      ...prev,
      [editMode]: { ...prev[editMode], [key]: value },
    }))
  }

  const applyPreset = (colors: Record<string, string>) => {
    setTheme((prev: any) => ({
      ...prev,
      [editMode]: { ...prev[editMode], ...colors },
    }))
  }

  const handleSave = async () => {
    if (!theme) return
    try {
      await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      })
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Theme saved!", "success")
    } catch {
      showToast("Failed to save theme", "error")
    }
  }

  if (loading || !theme) {
    return <div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-slate-200/50" /><div className="h-64 rounded-xl bg-slate-200/30" /></div>
  }

  const currentColors = theme[editMode] || {}

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-sora text-2xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
          <Palette className="h-6 w-6 text-[color:var(--accent-primary)]" />
          Theme Settings
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
          Customize colors for each theme mode.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-slate-200/50 p-1 dark:bg-slate-800/50 w-fit">
        {(Object.keys(THEME_LABELS) as ThemeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setEditMode(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 ${
              editMode === key
                ? "bg-white text-black shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
            }`}
          >
            {THEME_LABELS[key].emoji} {THEME_LABELS[key].label}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
          Quick Presets ({THEME_LABELS[editMode].label})
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS[editMode].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.colors)}
              className="flex items-center gap-2 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] px-3 py-2 text-xs font-bold text-[color:var(--text-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ background: `linear-gradient(135deg, ${preset.colors.primaryColor}, ${preset.colors.accentColor})` }}
              />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
          Custom Colors ({THEME_LABELS[editMode].label})
        </label>
        <div className="space-y-3">
          {COLOR_FIELDS.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-4 sm:flex-row sm:items-center"
            >
              <div className="w-44 shrink-0">
                <p className="text-sm font-bold text-[color:var(--text-primary)]">{label}</p>
                <p className="text-[11px] text-[color:var(--text-secondary)]">{description}</p>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="color"
                  value={currentColors[key] || "#000000"}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-[color:var(--card-border)] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={currentColors[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="input-shell flex-1 rounded-lg px-3 py-2 text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
          Preview ({THEME_LABELS[editMode].label})
        </label>
        <div
          className="rounded-2xl border p-6 transition-all duration-300"
          style={{
            background: currentColors.backgroundColor,
            borderColor: `${currentColors.accentColor}33`,
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-12 w-12 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${currentColors.primaryColor}, ${currentColors.secondaryColor})`,
              }}
            />
            <div>
              <h4 className="text-lg font-bold" style={{ color: currentColors.textColor }}>
                Sample Heading
              </h4>
              <p className="text-sm" style={{ color: currentColors.textColor, opacity: 0.6 }}>
                This is how text will look
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-lg px-4 py-2 text-sm font-bold text-white"
              style={{
                background: `linear-gradient(115deg, ${currentColors.secondaryColor}, ${currentColors.accentColor})`,
              }}
            >
              Primary Button
            </button>
            <button
              className="rounded-lg border px-4 py-2 text-sm font-bold"
              style={{
                borderColor: `${currentColors.accentColor}44`,
                color: currentColors.textColor,
              }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="btn-primary rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02]"
      >
        Save & Apply Theme
      </button>
    </div>
  )
}
