"use client"

import { Code2, Heart } from "lucide-react"
import { useSiteSettings } from "@/lib/useConfig"
import { scrollToId } from "@/lib/utils"

const FOOTER_LINKS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]

export function Footer() {
  const { data: settings } = useSiteSettings()

  return (
    <footer className="border-t border-[color:var(--card-border)] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <button onClick={() => scrollToId("home")} className="group flex items-center gap-2.5 font-sora text-lg font-semibold tracking-tight">
            <span className="inline-flex rounded-lg chip px-2 py-1 transition-transform duration-300 group-hover:scale-110">
              <Code2 className="h-4 w-4 text-[color:var(--accent-primary)]" />
            </span>
            <span className="transition-colors duration-300 group-hover:text-[color:var(--accent-primary)]">
              {settings?.brand_name || "Ayesha."}
            </span>
          </button>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToId(link.id)}
                  className="text-sm font-medium text-[color:var(--text-secondary)] transition-colors duration-300 hover:text-[color:var(--accent-primary)]"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[color:var(--card-border)] pt-6">
          <p className="text-center text-sm text-[color:var(--text-secondary)]">
            {settings?.footer_text ||
              "© 2026 Ayesha Afzal · Full-Stack Web & Mobile Engineer. Designed and built by me."}
            <span className="mx-2 text-[color:var(--accent-primary)]">·</span>
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 text-[color:var(--accent-primary)]" /> in Karachi
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}