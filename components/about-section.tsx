"use client"

import { User, CheckCircle2, MapPin, Laptop, Globe2, Radio, Rocket } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useAbout } from "@/lib/useConfig"
import { SectionHeading } from "@/components/section-heading"

const FOCUS = [
  { icon: Globe2, text: "Full-stack web applications with Next.js & Node.js" },
  { icon: Laptop, text: "Cross-platform mobile apps with React Native" },
  { icon: Radio, text: "Real-time & IoT systems with FastAPI, MQTT & WebSockets" },
  { icon: Rocket, text: "Production deployment, CI/CD and monitoring" },
]

export function AboutSection() {
  useScrollReveal()
  const { data: aboutData } = useAbout()

  return (
    <section id="about" className="section-shell relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          icon={User}
          chip="About Me"
          title="Full-stack engineer, product-minded."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3 reveal-left">
            <p className="mb-6 max-w-3xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">
              {aboutData?.description ||
                "Full-Stack Developer & UI/UX Designer with 4+ years of experience (2022\u20132026) building modern web and mobile applications. Specialized in scalable platforms, admin dashboards, and intuitive user interfaces using Next.js, React Native, and FastAPI."}
            </p>
            <p className="max-w-3xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">
              I work across the full product stack — from idea and Figma to interface, API, database and
              deployment — so a single product can move from design to production without changing teams.
            </p>
          </div>

          <div className="lg:col-span-2 reveal-right">
            <div className="glass-card rounded-2xl p-6 md:p-7">
              <h3 className="mb-5 flex items-center gap-2 font-sora text-lg font-extrabold">
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent-primary)]" />
                What I focus on
              </h3>
              <ul className="space-y-4">
                {FOCUS.map(({ text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm font-medium leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent-primary)]" />
                    <span className="text-[color:var(--text-secondary)]">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[color:var(--card-border)] pt-5">
                <span className="inline-flex items-center gap-1.5 chip px-3 py-1 text-xs font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-[color:var(--accent-primary)]" />
                  Karachi, Pakistan
                </span>
                <span className="chip px-3 py-1 text-xs font-semibold">Remote-friendly</span>
                <span className="chip px-3 py-1 text-xs font-semibold">English · Urdu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}