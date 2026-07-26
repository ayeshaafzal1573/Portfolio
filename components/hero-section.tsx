"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Terminal, Code, Cpu } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import Image from "next/image"
import { useProfile, useTypingRoles } from "@/lib/useConfig"

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
    const targetCoords = { x: 0, y: 0 }
    const currentCoords = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return
      targetCoords.x = (e.clientX / window.innerWidth - 0.5) * 30
      targetCoords.y = (e.clientY / window.innerHeight - 0.5) * 30
    }
    const updatePosition = () => {
      currentCoords.x += (targetCoords.x - currentCoords.x) * 0.08
      currentCoords.y += (targetCoords.y - currentCoords.y) * 0.08
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentCoords.x}px, ${currentCoords.y}px, 0)`
      }
      animationFrameId = requestAnimationFrame(updatePosition)
    }
    window.addEventListener("mousemove", handleMouseMove)
    updatePosition()
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section id="home" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 pt-24 pb-4">
      <style>{`
        @keyframes float-drift {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-24px) translateX(12px) rotate(4deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        .animate-float-drift { animation: float-drift infinite ease-in-out; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-20 blur-[80px] pulse-glow-bg" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] opacity-25 blur-[100px] pulse-glow-bg" style={{ animationDelay: "3s" }} />
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

      <div className="floating-dot right-16 top-36 h-24 w-24 opacity-40" style={{ background: "var(--accent-primary)" }} />
      <div className="floating-dot bottom-32 left-10 h-20 w-20 opacity-30" style={{ background: "var(--accent-secondary)", animationDelay: "1.5s" }} />

      <div ref={containerRef} className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 py-2 lg:grid-cols-2">
        <div className="space-y-8 text-left reveal-left active">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
            <Sparkles className="h-4 w-4 text-[color:var(--accent-primary)] animate-pulse" />
            <span>Available for Freelance & Full-time Roles</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "var(--accent-primary)" }}>
              {profile?.intro_label || "Hi, My Name Is"}
            </p>
            <h1 className="font-sora text-5xl font-extrabold leading-[1.1] md:text-6xl lg:text-7xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--text-primary)] via-[color:var(--text-primary)] to-[color:var(--accent-primary)]">
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

        <div className="flex justify-center lg:justify-end reveal-right active">
          <div className="relative group animate-float">
            <div className="absolute -inset-4 rounded-[2.5rem] opacity-40 blur-3xl group-hover:opacity-60 transition-opacity duration-500" style={{ background: "var(--gradient-main)" }} />
            <div className="relative h-[28rem] w-72 overflow-hidden rounded-[2rem] p-2.5 glass-card shadow-2xl hover:scale-[1.03] transition-transform duration-300">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={`${profile.name} - Full Stack Software Engineer`}
                  className="h-full w-full rounded-[1.6rem] object-cover filter brightness-[1.02]"
                />
              ) : (
                <Image
                  src="/ayesha-afzal-qadir.jpeg"
                  width={420}
                  height={560}
                  alt="Ayesha Afzal - Full Stack & Mobile Software Engineer"
                  className="h-full w-full rounded-[1.6rem] object-cover filter brightness-[1.02]"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
