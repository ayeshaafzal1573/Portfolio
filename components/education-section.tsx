"use client"

import { GraduationCap, Calendar, Award, BookOpen, MapPin } from "lucide-react"
import type { CSSProperties } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useEducationEntries } from "@/lib/useConfig"
import { SectionHeading } from "@/components/section-heading"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = { GraduationCap, Award, BookOpen, MapPin }

export function EducationSection() {
  useScrollReveal()
  const { data: entriesData } = useEducationEntries()
  const educationList = entriesData || []

  if (educationList.length === 0) return null

  return (
    <section id="education" className="section-shell relative overflow-hidden">
      <div
        className="glow-orb top-1/2 left-0 -translate-y-1/2 h-60 w-60"
        style={{ "--orb": "color-mix(in srgb, var(--accent-primary) 15%, transparent)" } as CSSProperties}
      />
      <div
        className="glow-orb bottom-10 right-0 h-64 w-64"
        style={{ "--orb": "color-mix(in srgb, var(--accent-secondary) 15%, transparent)" } as CSSProperties}
      />

      <div className="mx-auto max-w-6xl relative z-10">
        <SectionHeading
          icon={GraduationCap}
          chip="Education"
          title="Education"
          subtitle="Academic background — kept brief, professional in front."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 reveal-scale">
          {educationList.map((edu, index) => {
            const IconComponent = ICON_MAP[edu.icon] || GraduationCap
            return (
              <div
                key={edu.id || index}
                className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[color:var(--card-border)] bg-[color:var(--accent-soft)]">
                    <IconComponent className="h-5 w-5 text-[color:var(--accent-primary)]" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: edu.color }}>
                      <Calendar className="h-3.5 w-3.5" />
                      {edu.duration}
                    </span>
                    <span className="chip px-2.5 py-0.5 text-[10px] font-bold">{edu.grade}</span>
                  </div>
                </div>
                <h3 className="mb-1 font-sora text-base font-extrabold transition-colors duration-300 group-hover:text-[color:var(--accent-primary)]">
                  {edu.degree}
                </h3>
                <p className="mb-3 text-sm font-bold" style={{ color: edu.color }}>
                  {edu.institution}
                </p>
                <p className="mb-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">{edu.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(edu.badges || []).map((badge: string, idx: number) => (
                    <span
                      key={idx}
                      className="chip px-2.5 py-1 text-[10px] font-semibold transition-colors duration-300 group-hover:border-[color:var(--accent-primary)]/40"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}