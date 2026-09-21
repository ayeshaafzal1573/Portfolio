"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Sparkles, Terminal, Code, Cpu, Smartphone, Brain, Award, Briefcase } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { TiltCard } from "@/components/three/tilt-card"
import Image from "next/image"
import { useProfile, useTypingRoles } from "@/lib/useConfig"

const HERO_STATS = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 40, suffix: "+", label: "Projects Shipped" },
  { value: 15, suffix: "+", label: "Happy Clients" },
]

const MARQUEE_TECH = [
  "React", "Next.js", "TypeScript", "Node.js", "MongoDB", "PostgreSQL",
  "FastAPI", "Python", "React Native", "Tailwind", "Supabase", "AWS",
  "Docker", "GraphQL", "OpenAI", "Redis",
]

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
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
  }, [target, active, duration])
  return value
}

function HeroStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = window.setTimeout(() => setActive(true), delay)
          io.disconnect()
          return () => window.clearTimeout(t)
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  const count = useCountUp(value, active)
  return (
    <div ref={ref} className="relative flex-1 px-2 text-center sm:px-6">
      <p
        className="font-sora text-2xl font-extrabold leading-none sm:text-3xl md:text-4xl"
        style={{
          background: "var(--gradient-main)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {count}
        {suffix}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
        {label}
      </p>
      <span className="mx-auto mt-2 block h-0.5 w-6 rounded-full" style={{ background: "var(--accent-primary)" }} />
    </div>
  )
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [typedText, setTypedText] = useState("")
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: profile } = useProfile()
  const { data: rolesData } = useTypingRoles()

  const roles = rolesData?.map((r) => r.role) || []

  useScrollReveal()

  useEffect(() => {
    if (roles.length === 0) return
    let timer: NodeJS.Timeout
    const currentFullText = roles[roleIndex]
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
  }, [typedText, isDeleting, roleIndex, roles.length])

  useEffect(() => {
    let animationFrameId: number
    let running = false
    let settled = 0
    const targetCoords = { x: 0, y: 0 }
    const currentCoords = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return
      targetCoords.x = (e.clientX / window.innerWidth - 0.5) * 30
      targetCoords.y = (e.clientY / window.innerHeight - 0.5) * 30
      if (!running && containerRef.current) {
        running = true
        animationFrameId = requestAnimationFrame(updatePosition)
      }
    }
    const updatePosition = () => {
      currentCoords.x += (targetCoords.x - currentCoords.x) * 0.08
      currentCoords.y += (targetCoords.y - currentCoords.y) * 0.08
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentCoords.x}px, ${currentCoords.y}px, 0)`
      }
      if (
        Math.hypot(currentCoords.x - targetCoords.x, currentCoords.y - targetCoords.y) < 0.2
      ) {
        settled += 1
      } else {
        settled = 0
      }
      if (settled > 8) {
        running = false
        return
      }
      animationFrameId = requestAnimationFrame(updatePosition)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section id="home" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pt-24 pb-24">
      <style>{`
        @keyframes float-drift {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-24px) translateX(12px) rotate(4deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        .animate-float-drift { animation: float-drift infinite ease-in-out; }

        @keyframes hero-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .hero-name-shimmer {
          background-image: linear-gradient(100deg, var(--text-primary) 0%, var(--text-primary) 35%, var(--accent-primary) 50%, var(--text-primary) 65%, var(--text-primary) 100%);
          background-size: 200% 100%;
          animation: hero-shimmer 6s linear infinite;
        }

        @keyframes hero-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hero-marquee-track { animation: hero-marquee 26s linear infinite; }
        .hero-marquee:hover .hero-marquee-track { animation-play-state: paused; }

        @keyframes hero-ring-pulse {
          0% { box-shadow: 0 0 0 0 var(--ring-soft); }
          70% { box-shadow: 0 0 0 14px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .hero-badge-pulse { animation: hero-ring-pulse 2.6s ease-out infinite; }

        @keyframes hero-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-rise { animation: hero-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="glow-orb pulse-glow-bg top-[20%] left-[10%] h-[350px] w-[350px]"
          style={{ "--orb": "color-mix(in srgb, var(--accent-primary) 30%, transparent)" } as CSSProperties}
        />
        <div
          className="glow-orb pulse-glow-bg bottom-[20%] right-[10%] h-[400px] w-[400px]"
          style={{ "--orb": "color-mix(in srgb, var(--accent-secondary) 35%, transparent)", animationDelay: "3s" } as CSSProperties}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none font-mono text-[9px] sm:text-xs text-[color:var(--text-secondary)] opacity-[0.15]">
        <div className="absolute top-[12%] left-[8%] animate-float-drift select-none" style={{ animationDuration: '24s' }}>const [data, setData] = useState(null)</div>
        <div className="absolute top-[18%] right-[12%] animate-float-drift select-none" style={{ animationDuration: '28s', animationDelay: '2s' }}>async function getPayload()</div>
        <div className="absolute top-[55%] left-[4%] animate-float-drift select-none" style={{ animationDuration: '22s', animationDelay: '4s' }}>import &#123; NextRequest &#125; from &quot;next/server&quot;</div>
        <div className="absolute top-[72%] right-[15%] animate-float-drift select-none" style={{ animationDuration: '26s', animationDelay: '6s' }}>db.insert(users).values(&#123; name &#125;)</div>
        <div className="absolute top-[82%] left-[30%] animate-float-drift select-none" style={{ animationDuration: '30s', animationDelay: '8s' }}>return &lt;div className=&quot;flex&quot;&gt;</div>
        <div className="absolute top-[38%] left-[22%] animate-float-drift select-none" style={{ animationDuration: '25s', animationDelay: '1s' }}>await model.generate(prompt)</div>
        <div className="absolute top-[48%] right-[8%] animate-float-drift select-none" style={{ animationDuration: '27s', animationDelay: '3s' }}>npm install @supabase/supabase-js</div>
        <div className="absolute top-[10%] left-[45%] animate-float-drift select-none" style={{ animationDuration: '29s', animationDelay: '5s' }}>git commit -m &quot;feat: ai-copilot&quot;</div>
      </div>

      <div className="floating-dot right-16 top-[46%] h-24 w-24 opacity-40" style={{ background: "var(--accent-primary)" }} />
      <div className="floating-dot bottom-32 left-10 h-20 w-20 opacity-30" style={{ background: "var(--accent-secondary)", animationDelay: "1.5s" }} />

      <div ref={containerRef} className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 py-2 lg:grid-cols-2">
        <div className="space-y-8 text-left reveal-left active">
          <div className="flex flex-wrap items-center gap-3 hero-rise mt-5">
            <div className="hero-badge-pulse inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
              <Sparkles className="h-4 w-4 text-[color:var(--accent-primary)] animate-pulse" />
              <span>Available for Freelance & Full-time Roles</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] bg-[color:var(--accent-soft)]/60 px-4 py-1.5 text-sm font-bold tracking-wide backdrop-blur-md">
              <Award className="h-4 w-4 text-[color:var(--accent-secondary)]" />
              <span>4+ Years Experience</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.25em] hero-rise" style={{ color: "var(--accent-primary)", animationDelay: "0.05s" }}>
              {profile?.intro_label || "Hi, My Name Is"}
            </p>
            <h1 className="hero-name-shimmer font-sora text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl tracking-tight bg-clip-text text-transparent hero-rise" style={{ animationDelay: "0.12s" }}>
              {profile?.name || "Ayesha Afzal"}
            </h1>

            <div className="h-10 sm:h-12 flex items-center mt-4">
              <span className="text-xl font-bold md:text-3xl font-sora" style={{ color: "var(--accent-secondary)" }}>
                {typedText}
              </span>
              <span className="ml-1 w-[3px] h-7 bg-[color:var(--accent-secondary)] animate-pulse" />
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg mt-2">
              {profile?.description || "Specialized in engineering robust architectures using the MERN Stack, Next.js, FastAPI, and cross-platform mobile apps with React Native. Seamlessly merging clean aesthetics with modern performance practices."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 py-2">
            <div className="flex items-center gap-2 rounded-xl glass-card px-4 py-2 text-xs font-semibold">
              <Terminal className="h-4 w-4 text-[color:var(--accent-primary)]" />
              <span>Modern APIs</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl glass-card px-4 py-2 text-xs font-semibold">
              <Code className="h-4 w-4 text-[color:var(--accent-secondary)]" />
              <span>Full-Stack</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl glass-card px-4 py-2 text-xs font-semibold">
              <Cpu className="h-4 w-4 text-[color:var(--accent-primary)]" />
              <span>AI Integration</span>
            </div>
          </div>

          <div className="flex max-w-lg items-stretch divide-x divide-[color:var(--card-border)]">
            {HERO_STATS.map((stat, i) => (
              <HeroStat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} delay={i * 150} />
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center pt-2">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold btn-primary transition-all duration-300 hover:scale-[1.05] hover:shadow-lg hover:shadow-[var(--ring-soft)] cursor-pointer"
            >
              {profile?.cta_text || "Let's Build Together"}
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full px-8 py-4 text-base font-bold btn-secondary transition-all duration-300 hover:scale-[1.05] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              View Education & Journey
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end reveal-right active perspective-1600 preserve-3d">
          <div className="relative preserve-3d">
            <div className="absolute -inset-6 rounded-[2.5rem] opacity-50 blur-3xl pulse-glow-bg" style={{ background: "var(--gradient-main)" }} />
            <div className="animate-float">
            <TiltCard max={16} scale={1.02} className="relative">
              <div className="relative h-[22rem] w-56 bg-transparent sm:h-[28rem] sm:w-72">
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={`${profile.name} - Full Stack Software Engineer`}
                    className="h-full w-full object-contain drop-shadow-[0_18px_40px_var(--ring-soft)]"
                  />
                ) : (
                  <Image
                    src="/ayesha-afzal-qadir-v2.png"
                    width={420}
                    height={560}
                    alt="Ayesha Afzal - Full Stack & Mobile Software Engineer"
                    className="h-full w-full object-contain drop-shadow-[0_18px_40px_var(--ring-soft)]"
                    priority
                  />
                )}
              </div>
              <div className="absolute -left-6 top-8 hidden rounded-2xl glass-card px-4 py-2.5 text-sm font-bold shadow-xl depth-card-sm sm:block">
                <Terminal className="mb-1 h-4 w-4 text-[color:var(--accent-primary)]" />
                Full-Stack
              </div>
              <div className="absolute -right-5 top-1/3 hidden rounded-2xl glass-card px-4 py-2.5 text-sm font-bold shadow-xl depth-card sm:block">
                <Smartphone className="mb-1 h-4 w-4 text-[color:var(--accent-secondary)]" />
                React Native
              </div>
              <div className="absolute -left-12 bottom-16 hidden rounded-2xl glass-card px-4 py-2.5 text-sm font-bold shadow-xl depth-card-sm sm:block">
                <Brain className="mb-1 h-4 w-4 text-[color:var(--accent-primary)]" />
                AI Integration
              </div>
            </TiltCard>
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
