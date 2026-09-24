"use client"

import { useState, useEffect, useRef } from "react"
import { Code2, Menu, X, Sun, Moon, Flame } from "lucide-react"
import { useSiteSettings } from "@/lib/useConfig"
import { usePortfolioTheme } from "@/components/theme-provider"
import { scrollToId } from "@/lib/utils"
import type { ThemeMode } from "@/lib/theme"

const MODE_META: { mode: ThemeMode; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { mode: "dark", icon: Moon, label: "Dark mode" },
  { mode: "light", icon: Sun, label: "Light mode" },
  { mode: "warm", icon: Flame, label: "Warm mode" },
]

function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, modes } = usePortfolioTheme()
  return (
    <div className={`flex items-center rounded-full btn-secondary p-1 ${compact ? "" : "gap-0.5"}`} role="group" aria-label="Theme mode">
      {MODE_META.filter((m) => modes.includes(m.mode)).map(({ mode: m, icon: Icon, label }) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          aria-label={label}
          title={label}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
            mode === m ? "bg-[color:var(--accent-primary)] text-[color:var(--on-accent)] shadow-sm" : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]

const NAV_SECTIONS = NAV_ITEMS.map((item) => item.id)

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [active, setActive] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
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

  const scrollToSection = (id: string) => scrollToId(id)

  useEffect(() => {
    if (!menuOpen) return
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("resize", onResize)
    document.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("resize", onResize)
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

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
        <div className="hidden items-center gap-3 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`nav-link py-3 text-sm font-medium ${active === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
          <ThemeSwitcher />
          <button
            onClick={() => scrollToSection("contact")}
            className="nav-cta ml-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            Let&apos;s Work
          </button>
        </div>
        <div className="my-2 flex items-center gap-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center rounded-full p-2.5 btn-secondary md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 w-full max-w-7xl px-3 md:hidden">
          <div className="nav-pill glass-card flex flex-col overflow-hidden rounded-3xl p-2">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
                Theme Mode
              </span>
              <ThemeSwitcher />
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id)
                  setMenuOpen(false)
                }}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  active === item.id
                    ? "bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]"
                    : "text-[color:var(--text-secondary)] hover:bg-[color:var(--accent-soft)]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                scrollToSection("contact")
                setMenuOpen(false)
              }}
              className="nav-cta mt-1 rounded-2xl px-4 py-3 text-left text-sm font-extrabold cursor-pointer"
            >
              Let&apos;s Work
            </button>
          </div>
        </div>
      )}
      <div className="nav-progress" aria-hidden="true">
        <span className="nav-progress-fill" />
      </div>
    </nav>
  )
}