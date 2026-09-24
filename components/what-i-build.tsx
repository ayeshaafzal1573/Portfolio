"use client"

import { Layers } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { whatIBuild } from "@/lib/content"

export function WhatIBuild() {
  useScrollReveal()

  return (
    <section id="what-i-build" className="section-shell relative overflow-hidden bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--bg-secondary)_35%,transparent)]">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          icon={Layers}
          chip="Capabilities"
          title="What I Build"
          subtitle="Full-stack products across the entire delivery path — from interface to infrastructure."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal-scale stagger">
          {whatIBuild.map(({ title, description, tags }) => (
            <article
              key={title}
              className="group glass-card relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-[color:var(--accent-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="text-3d mb-3 font-sora text-2xl font-extrabold leading-tight">{title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">{description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="chip px-2.5 py-1 text-[10px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[color:var(--card-border)] p-6 text-center">
            <p className="max-w-[16rem] text-sm leading-relaxed text-[color:var(--text-secondary)]">
              <span className="block font-sora text-base font-extrabold text-[color:var(--text-primary)]">
                From idea → architecture → frontend → backend → deployment.
              </span>
              One engineer for the whole journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}