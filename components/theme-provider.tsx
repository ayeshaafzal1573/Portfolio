"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"

export const THEME_KEYS = ["pastel", "dark", "girly-blue"] as const
export type Theme = (typeof THEME_KEYS)[number]

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeColors {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
}

const CUSTOM_THEME_STORAGE_KEY = "portfolio-custom-theme"

function applyThemeColors(colors?: ThemeColors) {
  const root = document.documentElement
  const props = ["--bg-primary", "--text-primary", "--accent-primary", "--accent-secondary", "--gradient-main"]
  if (!colors) {
    for (const prop of props) root.style.removeProperty(prop)
    return
  }
  if (colors.backgroundColor) root.style.setProperty("--bg-primary", colors.backgroundColor)
  if (colors.textColor) root.style.setProperty("--text-primary", colors.textColor)
  if (colors.accentColor) root.style.setProperty("--accent-primary", colors.accentColor)
  if (colors.secondaryColor) root.style.setProperty("--accent-secondary", colors.secondaryColor)
  if (colors.primaryColor && colors.secondaryColor) {
    root.style.setProperty(
      "--gradient-main",
      `linear-gradient(115deg, ${colors.primaryColor} 0%, ${colors.secondaryColor} 50%, ${colors.accentColor || colors.primaryColor} 100%)`
    )
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const customThemeRef = useRef<Record<string, ThemeColors> | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null
    if (savedTheme && (THEME_KEYS as readonly string[]).includes(savedTheme)) {
      setThemeState(savedTheme)
    }
    try {
      const raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY)
      if (raw) customThemeRef.current = JSON.parse(raw)
    } catch {
      customThemeRef.current = null
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem("portfolio-theme", theme)
    const root = document.documentElement

    for (const key of THEME_KEYS) root.classList.remove(key)
    root.classList.add(theme, "theme-switching")
    applyThemeColors(customThemeRef.current?.[theme])

    const t = window.setTimeout(() => root.classList.remove("theme-switching"), 450)
    return () => window.clearTimeout(t)
  }, [theme, ready])

  useEffect(() => {
    const handler = async () => {
      try {
        const resp = await fetch("/api/theme")
        if (!resp.ok) return
        const json = await resp.json()
        if (json?.theme) {
          customThemeRef.current = json.theme
          localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(json.theme))
          applyThemeColors(json.theme[theme])
        }
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("portfolioConfigUpdated", handler)
    return () => window.removeEventListener("portfolioConfigUpdated", handler)
  }, [theme])

  const setTheme = (next: Theme) => setThemeState(next)

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
