"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "./theme-provider"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const cycleTheme = () => {
    const themes = ["pastel", "dark", "girly-blue"] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-5 w-5" />
      case "girly-blue":
        return <Palette className="h-5 w-5" />
      default:
        return <Sun className="h-5 w-5" />
    }
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 sm:px-6 md:px-8 backdrop-blur-xl transition-all duration-300 glass-card">
        <button
          onClick={() => scrollToSection("home")}
          className="py-3 text-xl font-sora font-semibold tracking-tight"
        >
          Ayesha.
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button onClick={() => scrollToSection("home")} className="nav-link py-3 text-sm font-medium">
            Home
          </button>
          <button onClick={() => scrollToSection("live-projects")} className="nav-link py-3 text-sm font-medium">
            Live Projects
          </button>
          <button onClick={() => scrollToSection("projects")} className="nav-link py-3 text-sm font-medium">
            Projects
          </button>
          <button onClick={() => scrollToSection("about")} className="nav-link py-3 text-sm font-medium">
            About
          </button>
          <button onClick={() => scrollToSection("contact")} className="nav-link py-3 text-sm font-medium">
            Contact
          </button>
        </div>

        <button
          onClick={cycleTheme}
          className="my-2 rounded-full p-2.5 btn-secondary transition-transform duration-200 hover:scale-105"
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </button>
      </div>
    </nav>
  )
}
