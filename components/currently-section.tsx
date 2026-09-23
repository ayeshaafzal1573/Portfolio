"use client"

import { Sunrise, Check } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { currentlyItems } from "@/lib/content"

export function CurrentlySection() {
  useScrollReveal()

  return (
    <section id="currently" className="section-shell">
      <div className="mx-auto max-w-3xl reveal-scale">
        <div className="glass-card relative overflow-hidden rounded-3xl p-7 md:p-9">
          <div className="absolute left-0 top-0 h-full w-1 bg-[color:var(--accent-primary)]" />
          <div className="mb-4 flex items-center gap-2 rounded-full chip w-fit px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            <Sunrise className="h-4 w-4 text-[color:var(--accent-primary)]" />
            Currently
          </div>
          <h2 className="mb-5 font-sora text-xl font-extrabold md:text-2xl">What keeps me busy right now</h2>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {currentlyItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-[color:var(--text-secondary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent-primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}