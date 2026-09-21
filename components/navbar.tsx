"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun, Palette, Code2, Check, Menu, X } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useSiteSettings } from "@/lib/useConfig"

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "live-projects", label: "Live Projects" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
]

const NAV_SECTIONS = NAV_ITEMS.map((item) => item.id)

const THEME_OPTIONS = [
  { key: "pastel" as const, label: "Light", icon: Sun, swatch: "linear-gradient(135deg,#f6efe4,#a2653c)" },
  { key: "dark" as const, label: "Dark", icon: Moon, swatch: "linear-gradient(135deg,#1b130c,#d9a25c)" },
  { key: "girly-blue" as const, label: "Warm", icon: Palette, swatch: "linear-gradient(135deg,#f9f2e8,#d89a67)" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [active, setActive] = useState("home")
  const [themeOpen, setThemeOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { data: settings } = useSiteSettings()

  useEffect(() => {
    const sections = NAV_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )
    let tops: number[] = []
    let scrollMax = 1
    let ticking = false
    let lastY = window.scrollY
    let rafId = 0

    const measure = () => {
      tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY)
      scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }

    const process = () => {
      ticking = false
      const y = lastY
      const scrolled = y > 24
      setIsScrolled((prev) => (scrolled === prev ? prev : scrolled))
      navRef.current?.style.setProperty("--p", Math.min(1, Math.max(0, y / scrollMax)).toFixed(4))

      const probe = y + window.innerHeight * 0.35
      let current = "home"
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= probe) current = NAV_SECTIONS[i]
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      lastY = window.scrollY
      if (ticking) return
      ticking = true
      rafId = requestAnimationFrame(process)
    }

    measure()
    process()
    window.addEventListener("scroll", onScroll, { passive: true })
    const reMeasure = () => measure()
    window.addEventListener("resize", reMeasure)
    window.addEventListener("load", reMeasure)
    window.addEventListener("portfolioConfigUpdated", reMeasure)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", reMeasure)
      window.removeEventListener("load", reMeasure)
      window.removeEventListener("portfolioConfigUpdated", reMeasure)
    }
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (!themeOpen) return
    const onDown = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) setThemeOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setThemeOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [themeOpen])

  const activeOption = THEME_OPTIONS.find((o) => o.key === theme) || THEME_OPTIONS[0]
  const ActiveIcon = activeOption.icon

  return (
    <nav
      ref={navRef}
      className={`nav-3d-load fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "nav-scrolled py-3" : "py-5"}`}
    >
      <div className="nav-pill mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 sm:px-6 md:px-8 backdrop-blur-xl glass-card">
        <button onClick={() => scrollToSection("home")} className="group flex items-center gap-2.5 py-3 font-sora text-xl font-semibold tracking-tight">
          <span className="inline-flex rounded-lg chip px-2 py-1 text-base transition-transform duration-300 group-hover:scale-110">
            <Code2 className="h-5 w-5 text-[color:var(--accent-primary)]" />
          </span>
          <span className="nav-brand transition-colors duration-300 group-hover:text-[color:var(--accent-primary)]">
            {settings?.brand_name || "Ayesha."}
          </span>
        </button>
        <div className="hidden items-center gap-4 md:flex">
          <button onClick={() => scrollToSection("home")} className={`nav-link py-3 text-sm font-medium ${active === "home" ? "active" : ""}`}>Home</button>
          <button onClick={() => scrollToSection("about")} className={`nav-link py-3 text-sm font-medium ${active === "about" ? "active" : ""}`}>About</button>
          <button onClick={() => scrollToSection("education")} className={`nav-link py-3 text-sm font-medium ${active === "education" ? "active" : ""}`}>Education</button>
          <button onClick={() => scrollToSection("live-projects")} className={`nav-link py-3 text-sm font-medium ${active === "live-projects" ? "active" : ""}`}>Live Projects</button>
          <button onClick={() => scrollToSection("projects")} className={`nav-link py-3 text-sm font-medium ${active === "projects" ? "active" : ""}`}>Projects</button>
          <button onClick={() => scrollToSection("contact")} className={`nav-link py-3 text-sm font-medium ${active === "contact" ? "active" : ""}`}>Contact</button>
        </div>
        <div ref={themeMenuRef} className="relative my-2">
          <button
            onClick={() => setThemeOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full px-3 py-2.5 btn-secondary"
            aria-label="Change theme"
            aria-expanded={themeOpen}
          >
            <ActiveIcon className="h-5 w-5" />
            <span className="hidden text-xs font-bold sm:inline">{activeOption.label}</span>
          </button>
          {themeOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-1.5 shadow-2xl backdrop-blur-xl">
              {THEME_OPTIONS.map(({ key, label, icon: Icon, swatch }) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key)
                    setThemeOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--accent-soft)]"
                >
                  <span className="h-6 w-6 shrink-0 rounded-full border border-[color:var(--card-border)]" style={{ background: swatch }} />
                  <span className="flex flex-1 items-center gap-2">
                    <Icon className="h-4 w-4 text-[color:var(--accent-primary)]" />
                    {label}
                  </span>
                  {theme === key && <Check className="h-4 w-4 text-[color:var(--accent-primary)]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="nav-progress" aria-hidden="true">
        <span className="nav-progress-fill" />
      </div>
    </nav>
  )
}