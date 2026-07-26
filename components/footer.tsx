"use client"

import { useSiteSettings } from "@/lib/useConfig"

export function Footer() {
  const { data: settings } = useSiteSettings()

  return (
    <footer className="border-t border-[color:var(--card-border)] px-6 py-3">
      <div className="mx-auto">
        <div className="flex items-center justify-center">
          <p className="text-center text-sm text-[color:var(--text-secondary)]">
            {settings?.footer_text || "© 2026 Ayesha Afzal. Crafting digital experiences with passion."}
          </p>
        </div>
      </div>
    </footer>
  )
}
