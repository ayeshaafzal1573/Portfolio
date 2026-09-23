"use client"

import { Briefcase, Calendar, Info } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useTimelineEntries } from "@/lib/useConfig"
import { SectionHeading } from "@/components/section-heading"

export function ExperienceSection() {
  useScrollReveal()
  const { data: timelineData } = useTimelineEntries()
  const timeline = timelineData || []

  return (
    <section id="experience" className="section-shell relative overflow-hidden bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--bg-secondary)_35%,transparent)]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          icon={Briefcase}
          chip="Experience"
          title="Professional Experience"
          subtitle="A concise history of where I have built products in production."
        />

        <div className="relative ml-3 border-l-2 border-[color:var(--card-border)] pl-8 md:ml-6 md:pl-12">
          {timeline.map((item, index) => (
            <div
              key={item.id || index}
              className="relative mb-10 last:mb-0 reveal"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="absolute -left-[42px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[color:var(--accent-primary)] bg-[color:var(--bg-primary)] md:-left-[54px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)]" />
              </span>

              <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-7">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full chip px-3 py-1 text-xs font-extrabold text-[color:var(--accent-primary)]">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.year}
                  </span>
                </div>
                <h3 className="mb-1.5 font-sora text-lg font-extrabold md:text-xl">{item.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">{item.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(item.skills || []).map((skill) => (
                    <span key={skill} className="chip px-2.5 py-1 text-[10px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-center text-xs leading-relaxed text-[color:var(--text-secondary)]">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--accent-primary)]" />
          The projects below in “Selected Work” include both the professional products above and select
          portfolio/demo builds — each one labeled with its type.
        </p>
      </div>
    </section>
  )
}