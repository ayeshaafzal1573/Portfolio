"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "./theme-provider"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
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
        return <Moon className="w-5 h-5" />
      case "girly-blue":
        return <Palette className="w-5 h-5" />
      default:
        return <Sun className="w-5 h-5" />
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-card" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-sora font-bold">
            <span className="pastel:text-purple-600 dark:text-blue-400 girly-blue:text-blue-500">{"<Portfolio/>"}</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("home")} className="hover:text-opacity-70 transition-colors">
              Home
            </button>
            <button
              onClick={() => scrollToSection("live-projects")}
              className="hover:text-opacity-70 transition-colors"
            >
              Live Projects
            </button>
            <button onClick={() => scrollToSection("projects")} className="hover:text-opacity-70 transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection("about")} className="hover:text-opacity-70 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-opacity-70 transition-colors">
              Contact
            </button>
          </div>

          <button
            onClick={cycleTheme}
            className="p-2 rounded-full glass-card hover:scale-110 transition-transform"
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>
    </nav>
  )
}
