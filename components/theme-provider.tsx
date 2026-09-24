"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  type ThemeConfig,
  type ThemeMode,
  DEFAULT_CONFIG,
  buildThemeVars,
  applyThemeVarsToRoot,
  setThemeModeAttr,
  getThemeModeAttr,
} from "@/lib/theme"

interface ThemeContextValue {
  config: ThemeConfig
  mode: ThemeMode
  modes: ThemeMode[]
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  config: DEFAULT_CONFIG,
  mode: "dark",
  modes: ["dark", "light", "warm"],
  setMode: () => {},
})

export function usePortfolioTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({
  config = DEFAULT_CONFIG,
  children,
}: {
  config?: ThemeConfig
  children: React.ReactNode
}) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Respect whatever the server already painted (no-fouc script / SSR attribute).
    const attr = getThemeModeAttr()
    return config.modes[attr] ? attr : config.default
  })

  useEffect(() => {
    const apply = (m: ThemeMode) => {
      setThemeModeAttr(m)
      if (config.modes[m]) applyThemeVarsToRoot(buildThemeVars(config.modes[m]))
    }
    apply(mode)
    document.documentElement.classList.add("theme-mounted")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, config])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
  }, [])

  const value = useMemo(
    () => ({
      config,
      mode,
      modes: ["dark", "light", "warm"] as ThemeMode[],
      setMode,
    }),
    [config, mode, setMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}