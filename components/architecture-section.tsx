"use client"

import { Network } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { howIBuild } from "@/lib/content"

export function ArchitectureSection() {
  useScrollReveal()

  return (
    <section id="architecture" className="section-shell relative overflow-hidden bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--bg-secondary)_30%,transparent)]">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          icon={Network}
          chip="Architecture"
          title="How I Build"
          subtitle="The mental model behind every product I ship — a clean layered architecture."
        />

        <div className="reveal-scale rounded-3xl glass-card p-6 md:p-10">
          <ol className="space-y-0">
            {howIBuild.map((layer, i) => (
              <li key={layer.label}>
                <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] px-5 py-4 transition-all duration-300 hover:border-[color:var(--accent-primary)]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-soft)] font-mono text-sm font-extrabold text-[color:var(--accent-primary)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-sora text-sm font-extrabold md:text-base">{layer.label}</p>
                    <p className="truncate text-xs text-[color:var(--text-secondary)]">{layer.detail}</p>
                  </div>
                </div>
                {i < howIBuild.length - 1 && (
                  <div className="flex justify-center py-1.5" aria-hidden="true">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="text-[color:var(--accent-secondary)]">
                      <path d="M10 0 L20 16 H0 Z" fill="currentColor" opacity="0.4" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-[color:var(--text-secondary)]">
            The same layers scale from a single-page product to a distributed system: UI → API → services →
            storage → real-time. Every feature finds a home in one of them, which keeps the codebase honest.
          </p>
        </div>
      </div>
    </section>
  )
}