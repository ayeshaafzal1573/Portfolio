"use client"

import { ShieldCheck } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { builtForProduction, productionIntro } from "@/lib/content"

export function ProductionSection() {
  useScrollReveal()

  return (
    <section id="production" className="section-shell relative overflow-hidden bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--bg-secondary)_30%,transparent)]">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          icon={ShieldCheck}
          chip="Production Engineering"
          title="Built for Production"
          subtitle={productionIntro}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 reveal-scale stagger">
          {builtForProduction.map(({ label, detail }) => (
            <article
              key={label}
              className="group glass-card flex flex-col gap-1 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="text-3d font-sora text-lg font-extrabold leading-tight">{label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--text-secondary)]">{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}