"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, ArrowRight } from "lucide-react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xPos = (clientX / innerWidth - 0.5) * 15
      const yPos = (clientY / innerHeight - 0.5) * 15

      containerRef.current.style.transform = `translate(${xPos}px, ${yPos}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 transition-transform duration-500 ease-out"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 tracking-wide">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-sora font-medium leading-tight">
                <span className="block text-lg md:text-xl font-light text-opacity-70 mb-2 uppercase tracking-widest">Hi, I'm</span>
                <span className="block pastel:text-purple-700 dark:text-blue-300 girly-blue:text-blue-700 animate-float">
                  Ayesha Afzal
                </span>
                <span
                  className="block text-2xl md:text-3xl lg:text-4xl font-light pastel:text-pink-600 dark:text-purple-300 girly-blue:text-blue-500 animate-float mt-3"
                  style={{ animationDelay: "0.5s" }}
                >
                  Software Engineer
                </span>
              </h1>

              <p className="text-base md:text-lg font-light text-opacity-70 max-w-xl leading-relaxed">
                Passionate about building scalable full-stack apps, combining beautiful design with efficient code. I specialize in the MERN Stack, Mobile Apps, and crafting clean, purposeful user experiences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <a
                href="/ayesha-afzal-qadir.pdf"
                download
                className="group px-10 py-5 bg-gradient-main text-slate-800 rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg font-semibold shadow-lg border border-white/40"
              >
                Download CV
                <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform text-slate-600" />
              </a>


              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-10 py-5 border-2 pastel:border-purple-300 dark:border-blue-400 girly-blue:border-blue-400 rounded-full hover:bg-opacity-10 pastel:hover:bg-purple-100 dark:hover:bg-blue-900 girly-blue:hover:bg-blue-100 transition-all duration-300 text-lg font-semibold"
              >
                Get in Touch
              </button>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div
                className="w-72 h-[26rem] md:w-80 md:h-[32rem] rounded-t-full rounded-b-3xl overflow-hidden glass-card p-1 lg:p-2 animate-float shadow-xl transition-all duration-700 hover:shadow-2xl hover:scale-[1.02]"
                style={{ animationDelay: "1s" }}
              >
                <img
                  src="/ayesha-afzal-qadir.jpeg"
                  width={400}
                  height={500}
                  alt="Ayesha Afzal, Full-Stack & Mobile App Developer"
                  className="w-full h-full object-cover rounded-t-full rounded-b-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Minimal floating decorative elements */}
              <div
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-main rounded-full opacity-60 animate-float filter blur-lg shadow-2xl"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-main rounded-full opacity-70 animate-float filter blur-lg shadow-2xl"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
