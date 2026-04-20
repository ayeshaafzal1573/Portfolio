"use client"

import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || window.innerWidth < 1024) return

      const xPos = (e.clientX / window.innerWidth - 0.5) * 14
      const yPos = (e.clientY / window.innerHeight - 0.5) * 14

      containerRef.current.style.transform = `translate(${xPos}px, ${yPos}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28">
      <div className="floating-dot right-16 top-36 h-24 w-24 opacity-40" style={{ background: "var(--accent-primary)" }} />
      <div className="floating-dot bottom-32 left-10 h-20 w-20 opacity-30" style={{ background: "var(--accent-secondary)", animationDelay: "1s" }} />

      <div
        ref={containerRef}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 py-10 transition-transform duration-500 ease-out lg:grid-cols-2"
      >
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full chip px-4 py-1.5 text-sm font-medium">
            Full-Stack Developer and UI/UX Designer
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Hi, I&apos;m</p>
            <h1 className="font-sora text-5xl font-semibold leading-tight md:text-6xl lg:text-7xl">
              Ayesha Afzal - Full Stack Developer Karachi
            </h1>
            <p className="text-xl font-medium md:text-2xl" style={{ color: "var(--accent-primary)" }}>
              Building scalable products with clean design and smart engineering
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">
              I create modern web and mobile experiences with MERN, Next.js, React Native, and production-ready backend
              architecture. I care about delightful interfaces and dependable performance.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="/ayesha-afzal-qadir.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold btn-primary transition-transform duration-200 hover:scale-[1.03]"
            >
              Download CV
              <ArrowDown className="h-5 w-5" />
            </a>

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full px-7 py-3.5 text-base font-semibold btn-secondary transition-transform duration-200 hover:scale-[1.03]"
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2.25rem] opacity-35 blur-2xl" style={{ background: "var(--gradient-main)" }} />
            <div className="relative h-[28rem] w-72 overflow-hidden rounded-[2rem] p-2 glass-card md:h-[32rem] md:w-80 animate-float">
              <img
                src="/ayesha-afzal-qadir.jpeg"
                width={420}
                height={560}
                alt="Ayesha Afzal, Full-Stack and Mobile App Developer"
                className="h-full w-full rounded-[1.6rem] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
