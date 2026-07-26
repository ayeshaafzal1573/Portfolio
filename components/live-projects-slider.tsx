"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { useLiveProjects } from "@/lib/useConfig"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function LiveProjectsSlider() {
  const { data: projects, loading } = useLiveProjects()
  const sliderRef = useRef<HTMLDivElement>(null)
  useScrollReveal()

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <section id="live-projects" className="section-shell">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center"><h2 className="section-title">Live Projects</h2></div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-80 flex-shrink-0 overflow-hidden rounded-2xl glass-card animate-pulse">
                <div className="h-48 bg-slate-300/60 dark:bg-slate-700/70" />
                <div className="space-y-4 p-6"><div className="h-5 rounded bg-slate-300/60 dark:bg-slate-700/70" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const projectList = projects || []

  return (
    <section id="live-projects" className="section-shell relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Play className="w-4 h-4 text-[color:var(--accent-primary)] animate-pulse" />
            Live Deployment
          </div>
          <h2 className="section-title">Live Production Apps</h2>
          <p className="section-subtitle mx-auto max-w-2xl text-lg">A curated list of functional products currently running in production environments.</p>
        </div>

        <div className="relative reveal-scale">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 btn-secondary hover:scale-110 transition-transform duration-200" aria-label="Scroll left">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 btn-secondary hover:scale-110 transition-transform duration-200" aria-label="Scroll right">
            <ChevronRight className="h-5 w-5" />
          </button>

          <div ref={sliderRef} className="hide-scrollbar flex gap-6 overflow-x-auto px-12 py-4" style={{ scrollSnapType: "x mandatory" }}>
            {projectList.map((project) => (
              <article key={project.id} className="group w-80 flex-shrink-0 overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" style={{ scrollSnapAlign: "start" }}>
                <div className="relative overflow-hidden">
                  <img src={project.thumbnail_url || "/placeholder.svg"} alt={project.name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="space-y-4 p-6">
                  <h3 className="font-sora text-xl font-extrabold">{project.name}</h3>
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full gap-2 rounded-full px-5 py-3 text-sm font-bold btn-primary hover:shadow-lg transition-all duration-300">
                    Launch App <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
