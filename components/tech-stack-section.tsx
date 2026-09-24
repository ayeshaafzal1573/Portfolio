"use client"

import { Globe2 } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { techStackCategories } from "@/lib/content"

export function TechStackSection() {
  useScrollReveal()

  return (
    <section id="skills" className="section-shell relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          icon={Globe2}
          chip="Tech Stack"
          title="Technologies I ship with"
          subtitle="Organized by where each technology fits in the product stack — not by arbitrary percentages."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal-scale stagger">
          {techStackCategories.map(({ label, icon: Icon, technologies }) => (
            <article
              key={label}
              className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex rounded-xl chip p-2.5 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-4 w-4 text-[color:var(--accent-primary)]" />
                </span>
                <h3 className="font-sora text-base font-extrabold">{label}</h3>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <li key={tech} className="chip px-3 py-1 text-xs font-semibold">
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="flex flex-col justify-center rounded-2xl border border-dashed border-[color:var(--card-border)] p-6">
            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
              Also comfortable with
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
              Supabase, Firebase, Jenkins, Prometheus, Grafana, CI/CD pipelines, cloud logs,
              authentication (JWT / role-based access), MUI, Zustand, and connecting MQTT/WebSocket
              data streams.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}