"use client"

import React from "react"
import { Mail, FileText, Github, Linkedin, Sparkles } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function HireMeSection() {
  useScrollReveal()

  const mailto = "mailto:ayeshaafzal1573@gmail.com?subject=Collaboration%20Opportunity"
  const resumeUrl = "https://drive.google.com/file/d/1GGuBWHrTkwG982hPpZNWLrSMPMc7qOoA/view?usp=sharing"
  const githubUrl = "https://github.com/ayeshaafzal1573"
  const linkedInUrl = "https://www.linkedin.com/in/ayeshaafzalqadir/"

  return (
    <section id="hire-me" className="section-shell relative overflow-hidden py-24">
      {/* Background ambient glow circles */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] blur-[100px] pointer-events-none pulse-glow-bg" 
        style={{ zIndex: -1 }}
      />
      <div 
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-[color-mix(in_srgb,var(--accent-secondary)_8%,transparent)] blur-[100px] pointer-events-none pulse-glow-bg" 
        style={{ zIndex: -1, animationDelay: "2s" }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="glass-card rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden group shadow-2xl reveal-scale border border-[color:var(--card-border)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)]">
          {/* Subtle inside gradient background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[color-mix(in_srgb,var(--accent-primary)_3%,transparent)] via-transparent to-[color-mix(in_srgb,var(--accent-secondary)_4%,transparent)] pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            {/* Elegant Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-2 text-xs font-bold uppercase tracking-wider mb-2 reveal">
              <Sparkles className="w-4 h-4 text-[color:var(--accent-primary)] animate-pulse" />
              <span>Available for Hire</span>
            </div>

            {/* Main Header with dynamic gradient text */}
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--text-primary)] via-[color:var(--accent-primary)] to-[color:var(--accent-secondary)] leading-tight max-w-3xl mx-auto reveal delay-100">
              Ready to Build Something Amazing?
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-[color:var(--text-secondary)] leading-relaxed reveal delay-200">
              I&apos;m open to freelance projects, full‑time roles, and collaborations that push the boundaries of technology. Let&apos;s build something outstanding together.
            </p>

            {/* Beautiful Interactive Button Grid */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 pt-4 reveal delay-300">
              {/* Primary Email CTA Button */}
              <a 
                href={mailto} 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 btn-primary text-white font-extrabold rounded-full shadow-lg shadow-[var(--ring-soft)] hover:scale-[1.05] hover:shadow-xl hover:shadow-[color-mix(in_srgb,var(--accent-primary)_30%,transparent)] transition-all duration-300 group/btn"
              >
                <Mail className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                <span>Email Me</span>
              </a>

              {/* Secondary Download Resume Button */}
              <a 
                href={resumeUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 btn-secondary font-bold rounded-full shadow-sm hover:scale-[1.05] hover:text-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 group/btn"
              >
                <FileText className="w-5 h-5 text-[color:var(--accent-primary)] transition-transform duration-300 group-hover/btn:scale-110" />
                <span>Download Resume</span>
              </a>

              {/* GitHub Button */}
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 btn-secondary font-bold rounded-full shadow-sm hover:scale-[1.05] hover:text-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 group/btn"
              >
                <Github className="w-5 h-5 text-[color:var(--accent-primary)] transition-transform duration-300 group-hover/btn:scale-110" />
                <span>GitHub</span>
              </a>

              {/* LinkedIn Button */}
              <a 
                href={linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 btn-secondary font-bold rounded-full shadow-sm hover:scale-[1.05] hover:text-[color:var(--accent-primary)] hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 group/btn"
              >
                <Linkedin className="w-5 h-5 text-[color:var(--accent-primary)] transition-transform duration-300 group-hover/btn:scale-110" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

