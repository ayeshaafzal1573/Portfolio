// lib/theme.ts — theme engine (dark / light / warm) + CSS variable builder.
// Everything is derived from five colours per mode so the admin can restyle
// the whole site from a tiny set of inputs.

export type ThemeMode = "dark" | "light" | "warm"

export interface ThemePalette {
  textColor: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  accentColor: string
}

export interface ChatbotConfig {
  enabled?: boolean
  botName: string
  welcome: string
  subtitle: string
  model: string
}

export interface ThemeConfig {
  default: ThemeMode
  modes: Record<ThemeMode, ThemePalette>
  chatbot: ChatbotConfig
}

export const THEME_MODES: ThemeMode[] = ["dark", "light", "warm"]

export const DEFAULT_CONFIG: ThemeConfig = {
  default: "dark",
  modes: {
    dark: {
      backgroundColor: "#050505",
      textColor: "#f5f5f5",
      primaryColor: "#ffffff",
      secondaryColor: "#a3a3a3",
      accentColor: "#ffffff",
    },
    light: {
      backgroundColor: "#ffffff",
      textColor: "#24221e",
      primaryColor: "#000000",
      secondaryColor: "#6f6a61",
      accentColor: "#000000",
    },
    warm: {
      backgroundColor: "#f7f5f0",
      textColor: "#24221e",
      primaryColor: "#24221e",
      secondaryColor: "#6f6a61",
      accentColor: "#24221e",
    },
  },
  chatbot: {
    botName: "Ayesha's Copilot",
    welcome:
      "Hi there! I'm Ayesha's AI assistant, powered by Gemini. Ask me about her skills, experience, projects, or how to hire her!",
    subtitle: "AI Assistant",
    model: "gemini-2.0-flash",
  },
}

// ─── Colour helpers ────────────────────────────────────────────────────────────

export function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  const num = parseInt(h, 16)
  if (Number.isNaN(num)) return [0, 0, 0]
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

export function toHex([r, g, b]: [number, number, number]): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")
  return `#${c(r)}${c(g)}${c(b)}`
}

/** Mix two colours: w = weight of a (0 → b, 1 → a). */
export function mixHex(a: string, b: string, w: number): string {
  const ca = parseHex(a)
  const cb = parseHex(b)
  return toHex([
    ca[0] * w + cb[0] * (1 - w),
    ca[1] * w + cb[1] * (1 - w),
    ca[2] * w + cb[2] * (1 - w),
  ])
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Relative luminance (0..1) for contrast decisions. */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => v / 255)
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** Pick black or near-white text to sit on top of a given background. */
export function onTopOf(hex: string): string {
  return luminance(hex) > 0.35 ? "#0b0b0b" : "#ffffff"
}

// ─── CSS variable builder ──────────────────────────────────────────────────────

export function buildThemeVars(palette: ThemePalette): Record<string, string> {
  const bg = palette.backgroundColor
  const text = palette.textColor
  const prim = palette.primaryColor
  const sec = palette.secondaryColor
  const dark = luminance(bg) < 0.3

  const surfaceMix = dark ? mixHex(bg, text, 0.07) : mixHex(bg, text, 0.05)
  const strongMix = dark ? mixHex(bg, text, 0.1) : mixHex(bg, text, 0.03)

  return {
    "--bg-primary": bg,
    "--bg-secondary": mixHex(bg, text, dark ? 0.05 : 0.035),
    "--surface": rgba(surfaceMix, refreshAlpha(dark, 0.72)),
    "--surface-strong": rgba(strongMix, refreshAlpha(dark, 0.94)),
    "--text-primary": text,
    "--text-secondary": mixHex(text, bg, dark ? 0.28 : 0.35),
    "--text-muted": mixHex(text, bg, dark ? 0.5 : 0.55),
    "--accent-primary": prim,
    "--accent-secondary": sec,
    "--accent-soft": mixHex(bg, prim, dark ? 0.08 : 0.06),
    "--ring-soft": rgba(prim, 0.16),
    "--card-border": mixHex(bg, text, dark ? 0.16 : 0.14),
    "--card-border-hover": mixHex(bg, text, dark ? 0.3 : 0.3),
    "--gradient-main": `linear-gradient(115deg, ${prim} 0%, ${sec} 45%, ${mixHex(sec, bg, 0.35)} 100%)`,
    "--on-accent": onTopOf(prim),
  }
}

// Small helper so surface alpha reads naturally for both lightness extremes.
function refreshAlpha(dark: boolean, value: number): number {
  return dark ? value : Math.min(0.94, value + 0.08)
}

export function applyThemeVarsToRoot(vars: Record<string, string>) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
}

export function setThemeModeAttr(mode: ThemeMode) {
  if (typeof document === "undefined") return
  document.documentElement.setAttribute("data-theme", mode)
}

export function getThemeModeAttr(): ThemeMode {
  if (typeof document === "undefined") return "dark"
  const attr = document.documentElement.getAttribute("data-theme")
  return attr === "light" || attr === "warm" || attr === "dark" ? attr : "dark"
}

/** Deep-merge a stored (possibly partial) config over the defaults. */
export function normalizeConfig(raw: unknown): ThemeConfig {
  const candidate = (raw || {}) as Partial<ThemeConfig>
  const modes = { ...DEFAULT_CONFIG.modes }
  const storedModes = candidate.modes
  if (storedModes && typeof storedModes === "object") {
    ;(Object.keys(storedModes) as ThemeMode[]).forEach((key) => {
      if (THEME_MODES.includes(key) && storedModes[key] && typeof storedModes[key] === "object") {
        modes[key] = { ...DEFAULT_CONFIG.modes[key], ...(storedModes[key] as ThemePalette) }
      }
    })
  }
  const chatbot = { ...DEFAULT_CONFIG.chatbot, ...(candidate.chatbot || {}) }
  const defaultMode = THEME_MODES.includes((candidate as { default?: string }).default as ThemeMode)
    ? ((candidate as { default?: string }).default as ThemeMode)
    : "dark"
  return { default: defaultMode, modes, chatbot }
}