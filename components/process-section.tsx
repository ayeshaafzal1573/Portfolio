"use client"

import { Workflow } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { workflowSteps } from "@/lib/content"

export function ProcessSection() {
  useScrollReveal()

  return (
    <section id="process" className="section-shell relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          icon={Workflow}
          chip="Process"
          title="From Idea → Production"
          subtitle="A repeatable path I follow so projects move forward without guesswork."
        />

        <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[3.35rem] hidden h-px bg-gradient-to-r from-[color:var(--accent-primary)] via-[color:var(--accent-secondary)] to-transparent opacity-40 lg:block"
          />
          {workflowSteps.map((step, i) => (
            <li key={step.step} className="reveal group relative" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="flex flex-col items-center rounded-2xl glass-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:items-center">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[color:var(--accent-primary)] bg-[color:var(--bg-primary)] font-mono text-xs font-extrabold text-[color:var(--accent-primary)]">
                  {step.step}
                </span>
                <h3 className="mb-1 font-sora text-sm font-extrabold">{step.title}</h3>
                <p className="text-xs leading-relaxed text-[color:var(--text-secondary)]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}