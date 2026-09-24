"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Sparkles, Award, ArrowRight, FileText, Mail } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import Image from "next/image"
import { useProfile, useTypingRoles } from "@/lib/useConfig"
import { heroTech, heroHeadline, heroSubtext, stats } from "@/lib/content"
import { scrollToId } from "@/lib/utils"

const MARQUEE_TECH = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "FastAPI",
  "Python",
  "React Native",
  "Tailwind",
  "Supabase",
  "Docker",
  "Redis",
  "MQTT",
]

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!active || reduced) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration, reduced])

  if (reduced) return target
  return value
}

function HeroStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const fallbackCta = String.fromCodePoint(0x2013)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: number | undefined
    const activate = () => {
      if (started.current) return
      started.current = true
      timer = window.setTimeout(() => setActive(true), delay)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) activate()
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    )
    io.observe(el)
    // Activate immediately if the stat is already on screen (e.g. top of page)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) activate()
    return () => {
      io.disconnect()
      if (timer) window.clearTimeout(timer)
    }
  }, [delay])

  const count = useCountUp(value, active)

  return (
    <div ref={ref} className="relative flex-1 px-2 text-center sm:px-6">
      <p
        className="font-sora origin-center text-2xl font-extrabold leading-none sm:text-3xl md:text-4xl"
        style={{
          minHeight: "2.25rem",
          color: "var(--text-primary)",
          opacity: active ? 1 : 0.4,
          transition: "opacity 300ms ease",
        }}
      >
        {active ? (
          <>
            {count}
            {suffix}
          </>
        ) : (
          <span aria-hidden="true" className="select-none">
            {fallbackCta}
          </span>
        )}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
        {label}
      </p>
      <span className="mx-auto mt-2 block h-0.5 w-6 rounded-full" style={{ background: "var(--accent-primary)" }} />
    </div>
  )
}

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: profile } = useProfile()
  const { data: rolesData } = useTypingRoles()
  const reduced = usePrefersReducedMotion()

  const roles = (rolesData?.map((r) => r.role) || []).length
    ? rolesData!.map((r) => r.role)
    : ["Full-Stack Engineer", "React Native Developer", "Next.js & Node.js", "FastAPI & PostgreSQL"]

  useScrollReveal()

  useEffect(() => {
    if (reduced) {
      setTypedText(roles[0] || "")
      return
    }
    if (roles.length === 0) return
    let timer: NodeJS.Timeout
    const currentFullText = roles[roleIndex] || ""
    if (isDeleting) {
      timer = setTimeout(() => setTypedText(currentFullText.substring(0, typedText.length - 1)), 35)
    } else {
      timer = setTimeout(() => setTypedText(currentFullText.substring(0, typedText.length + 1)), 70)
    }
    if (!isDeleting && typedText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }
    return () => clearTimeout(timer)
  }, [typedText, isDeleting, roleIndex, roles, reduced])

  const resumeUrl =
    "https://drive.google.com/file/d/1GGuBWHrTkwG982hPpZNWLrSMPMc7qOoA/view?usp=sharing"

  // Prefer a real image URL; never ship the heavy base64 data-URI to the client.
  const portraitSrc = profile?.profile_image && /^https?:\/\//.test(profile.profile_image)
    ? profile.profile_image
    : null

  const rolesSentence = roles.join(", ")

  return (
    <section id="home" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pb-28 pt-24">
      <style>{`
        @keyframes hero-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hero-marquee-track { animation: hero-marquee 30s linear infinite; }
        .hero-marquee:hover .hero-marquee-track { animation-play-state: paused; }

        @keyframes hero-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-rise { animation: hero-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .hero-marquee-track, .hero-rise { animation: none !important; }
        }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="glow-orb pulse-glow-bg top-[15%] right-[15%] h-[380px] w-[380px]"
          style={{ "--orb": "color-mix(in srgb, var(--accent-primary) 26%, transparent)" } as CSSProperties}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 py-2 lg:grid-cols-2">
        <div className="space-y-7 text-left reveal-left active">
          <div className="flex flex-wrap items-center gap-3 hero-rise">
            <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
              <Sparkles className="h-4 w-4 text-[color:var(--accent-primary)]" />
              <span>Available for Freelance &amp; Full-time</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] bg-[color:var(--accent-soft)]/60 px-4 py-1.5 text-sm font-bold tracking-wide backdrop-blur-md">
              <Award className="h-4 w-4 text-[color:var(--accent-secondary)]" />
              <span>Full-Stack · Web &amp; Mobile</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="hero-rise text-sm font-bold uppercase tracking-[0.25em] text-[color:var(--text-primary)]" style={{ animationDelay: "0.05s" }}>
              {profile?.name || "Ayesha Afzal"}
            </p>
            <h1 className="font-sora text-3xl font-extrabold leading-[1.12] tracking-tight text-[color:var(--text-primary)] hero-rise sm:text-4xl md:text-5xl lg:text-6xl" style={{ animationDelay: "0.12s" }}>
              {heroHeadline}
            </h1>

            <div className="mt-2 flex h-10 items-center sm:h-12" aria-hidden="true">
              <span className="font-sora text-lg font-bold text-[color:var(--accent-secondary)] md:text-2xl">
                {typedText}
              </span>
              <span className="ml-1 h-6 w-[3px] bg-[color:var(--accent-secondary)] animate-pulse" />
            </div>

            <p className="sr-only">{rolesSentence}</p>

            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">
              {heroSubtext}
            </p>
          </div>

          <div className="flex max-w-lg items-stretch divide-x divide-[color:var(--card-border)]" aria-label="Profile statistics">
            {stats.map((stat, i) => (
              <HeroStat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={i * 150} />
            ))}
          </div>

          <div className="flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-[color:var(--card-border)] pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
              Core stack
            </span>
            {heroTech.map((tech, i) => (
              <span key={tech} className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--text-primary)]">
                {tech}
                {i < heroTech.length - 1 && <span className="text-[color:var(--accent-secondary)]">·</span>}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center">
            <button
              onClick={() => scrollToId("work")}
              className="btn-primary btn-press inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all duration-300 hover:shadow-lg"
            >
              View My Work
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToId("contact")}
              className="btn-secondary inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all duration-300"
            >
              <Mail className="h-4 w-4 text-[color:var(--accent-primary)]" />
              Let&apos;s Work Together
            </button>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[color:var(--text-secondary)] transition-colors duration-300 hover:text-[color:var(--accent-primary)]"
            >
              <FileText className="h-4 w-4" />
              Download CV
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end reveal-right active">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] opacity-40 blur-3xl pulse-glow-bg" style={{ background: "var(--gradient-main)" }} />
            <div className="relative h-[22rem] w-56 sm:h-[28rem] sm:w-72">
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt={`${profile?.name || "Ayesha Afzal"} - Full Stack Software Engineer`}
                  className="h-full w-full object-contain drop-shadow-[0_18px_40px_var(--ring-soft)]"
                />
              ) : (
                <Image
                  src="/ayesha-afzal-qadir.png"
                  width={420}
                  height={560}
                  alt="Ayesha Afzal - Full Stack & Mobile Software Engineer"
                  className="h-full w-full object-contain drop-shadow-[0_18px_40px_var(--ring-soft)]"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-marquee absolute inset-x-0 bottom-0 z-0 overflow-hidden border-y border-[color:var(--card-border)] bg-[color:var(--surface)]/40 py-3 backdrop-blur-sm">
        <div className="hero-marquee-track flex w-max items-center gap-10 pr-10">
          {[...MARQUEE_TECH, ...MARQUEE_TECH].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-3 font-sora text-sm font-bold uppercase tracking-widest text-[color:var(--text-secondary)]"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: i % 2 === 0 ? "var(--accent-primary)" : "var(--accent-secondary)" }} />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}