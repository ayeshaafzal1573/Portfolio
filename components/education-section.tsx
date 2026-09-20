"use client"

import { GraduationCap, Calendar, Award, BookOpen, MapPin } from "lucide-react"
import type { CSSProperties } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useEducationEntries } from "@/lib/useConfig"
import { TiltCard } from "@/components/three/tilt-card"

const ICON_MAP: Record<string, React.ComponentType<any>> = { GraduationCap, Award, BookOpen, MapPin }

export function EducationSection() {
  useScrollReveal()
  const { data: entriesData } = useEducationEntries()
  const educationList = entriesData || []

  return (
    <section id="education" className="section-shell relative overflow-hidden bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--bg-secondary)_40%,transparent)]">
      <div
        className="glow-orb top-1/2 left-0 -translate-y-1/2 h-72 w-72"
        style={{ "--orb": "color-mix(in srgb, var(--accent-primary) 18%, transparent)" } as CSSProperties}
      />
      <div
        className="glow-orb bottom-10 right-0 h-80 w-80"
        style={{ "--orb": "color-mix(in srgb, var(--accent-secondary) 18%, transparent)" } as CSSProperties}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4 text-[color:var(--accent-primary)]" />
            Academic Path
          </div>
          <h2 className="section-title">Education </h2>
          <p className="section-subtitle text-xl max-w-2xl mx-auto">
            A comprehensive overview of my academic background and professional technical certifications.
          </p>
        </div>

        <div className="relative border-l-2 border-slate-300/40 dark:border-slate-700/60 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
          {educationList.map((edu, index) => {
            const IconComponent = ICON_MAP[edu.icon] || GraduationCap
            return (
              <div
                key={edu.id || index}
                className={`relative reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="absolute -left-[50px] md:-left-[66px] top-1.5 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[color:var(--bg-primary)] shadow-md transition-transform duration-300 hover:scale-110"
                  style={{ background: edu.color }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                <div className="absolute -left-[190px] top-3 hidden md:flex flex-col items-end w-32">
                  <div className="flex items-center gap-1.5 text-sm font-bold tracking-wider" style={{ color: edu.color }}>
                    <Calendar className="w-4 h-4" />
                    <span>{edu.duration}</span>
                  </div>
                  <span className="text-xs text-[color:var(--text-secondary)] font-medium mt-1">{edu.grade}</span>
                </div>

                <TiltCard className="glass-card rounded-2xl p-6 md:p-8 group shadow-lg relative overflow-hidden" max={7}>
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${edu.color}, transparent)` }} />

                  <div className="flex md:hidden items-center justify-between gap-2 mb-4 flex-wrap">
                    <div className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full chip">
                      <Calendar className="w-3.5 h-3.5 text-[color:var(--accent-primary)]" />
                      <span>{edu.duration}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50" style={{ color: edu.color }}>{edu.grade}</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-sora font-extrabold text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)] transition-colors duration-300">{edu.degree}</h3>
                      <p className="text-md font-bold mt-1" style={{ color: edu.color }}>{edu.institution}</p>
                    </div>
                  </div>

                  <p className="text-sm md:text-base leading-relaxed text-[color:var(--text-secondary)] mb-6">{edu.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {(edu.badges || []).map((badge: string, idx: number) => (
                      <span key={idx} className="px-3.5 py-1 text-xs font-semibold rounded-full border border-slate-300/30 dark:border-slate-700/30 bg-slate-200/30 dark:bg-slate-800/30 text-[color:var(--text-secondary)] group-hover:border-[color:var(--accent-primary)]/30 transition-colors duration-300">{badge}</span>
                    ))}
                  </div>
                </TiltCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
