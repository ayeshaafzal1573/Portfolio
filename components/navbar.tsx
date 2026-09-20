"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun, Palette, Code2 } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useSiteSettings } from "@/lib/useConfig"

const NAV_SECTIONS = ["home", "about", "education", "live-projects", "projects", "contact"]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [active, setActive] = useState("home")
  const navRef = useRef<HTMLElement>(null)
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

  const cycleTheme = () => {
    const themes = ["pastel", "dark", "girly-blue"] as const
    const currentIndex = themes.indexOf(theme)
    setTheme(themes[(currentIndex + 1) % themes.length])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "dark": return <Moon className="h-5 w-5" />
      case "girly-blue": return <Palette className="h-5 w-5" />
      default: return <Sun className="h-5 w-5" />
    }
  }

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
        <div className="hidden items-center gap-1 md:flex">
          <button onClick={() => scrollToSection("home")} className={`nav-link py-3 text-sm font-medium ${active === "home" ? "active" : ""}`}>Home</button>
          <button onClick={() => scrollToSection("about")} className={`nav-link py-3 text-sm font-medium ${active === "about" ? "active" : ""}`}>About</button>
          <button onClick={() => scrollToSection("education")} className={`nav-link py-3 text-sm font-medium ${active === "education" ? "active" : ""}`}>Education</button>
          <button onClick={() => scrollToSection("live-projects")} className={`nav-link py-3 text-sm font-medium ${active === "live-projects" ? "active" : ""}`}>Live Projects</button>
          <button onClick={() => scrollToSection("projects")} className={`nav-link py-3 text-sm font-medium ${active === "projects" ? "active" : ""}`}>Projects</button>
          <button onClick={() => scrollToSection("contact")} className={`nav-link py-3 text-sm font-medium ${active === "contact" ? "active" : ""}`}>Contact</button>
        </div>
        <button onClick={cycleTheme} className="my-2 rounded-full p-2.5 btn-secondary" aria-label="Toggle theme">
          {getThemeIcon()}
        </button>
      </div>
      <div className="nav-progress" aria-hidden="true">
        <span className="nav-progress-fill" />
      </div>
    </nav>
  )
}