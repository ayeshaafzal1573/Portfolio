"use client"

import React from "react"
import { Mail, FileText, Sparkles, ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useContactInfo } from "@/lib/useConfig"
import { SectionHeading } from "@/components/section-heading"
import { services, servicesHeading, servicesSubtext, type Service } from "@/lib/content"
import { scrollToId } from "@/lib/utils"

export function HireMeSection() {
  useScrollReveal()
  const { data: contactData } = useContactInfo()

  const email = contactData?.email || "ayeshaafzal1573@gmail.com"
  const mailto = `mailto:${email}?subject=Project%20Inquiry`
  const resumeUrl =
    contactData?.resume_url ||
    "https://drive.google.com/file/d/1GGuBWHrTkwG982hPpZNWLrSMPMc7qOoA/view?usp=sharing"

  return (
    <section id="services" className="section-shell relative overflow-hidden">
      <div
        className="glow-orb pulse-glow-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] md:h-[480px] md:w-[480px]"
        style={{ "--orb": "color-mix(in srgb, var(--accent-primary) 14%, transparent)" } as React.CSSProperties}
      />

      <div className="mx-auto max-w-6xl text-center">
        <SectionHeading
          icon={Sparkles}
          chip="Let's Build"
          title={servicesHeading}
          subtitle={servicesSubtext}
        />

        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 reveal-scale">
          {services.map(({ icon: Icon, label }: Service) => (
            <div
              key={label}
              className="glass-card group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="h-4 w-4 shrink-0 text-[color:var(--accent-primary)] transition-transform duration-300 group-hover:scale-110" />
              <span className="text-xs font-bold sm:text-sm">{label}</span>
            </div>
          ))}
        </div>

        <div className="reveal-scale rounded-[2rem] border border-[color:var(--card-border)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] p-8 text-center shadow-2xl relative overflow-hidden md:p-14">
          <div className="absolute inset-0 bg-gradient-to-tr from-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)] via-transparent to-[color-mix(in_srgb,var(--accent-secondary)_5%,transparent)] pointer-events-none" />
          <div className="relative z-10 space-y-7">
            <h2 className="mx-auto max-w-3xl font-sora text-2xl font-extrabold leading-tight md:text-4xl">
              Have a product idea, design, or project that needs shipping?
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)]">
              I turn ideas, Figma designs, and existing applications into polished web or mobile products —
              and I stay for the backend, deployment and maintenance.
            </p>
            <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
              <a
                href={mailto}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 btn-primary text-base font-extrabold shadow-lg hover:scale-[1.05] transition-all duration-300 sm:w-auto"
              >
                <Mail className="h-5 w-5" />
                Discuss Your Project
              </a>
              <button
                onClick={() => scrollToId("work")}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 btn-secondary text-base font-bold hover:scale-[1.05] transition-all duration-300 sm:w-auto cursor-pointer"
              >
                View My Work
                <ArrowRight className="h-4 w-4 text-[color:var(--accent-primary)]" />
              </button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold text-[color:var(--text-secondary)] transition-colors duration-300 hover:text-[color:var(--accent-primary)] sm:w-auto"
              >
                <FileText className="h-4 w-4 text-[color:var(--accent-primary)]" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}