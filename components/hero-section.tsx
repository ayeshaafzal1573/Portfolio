"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const blobs: Array<{
      x: number
      y: number
      size: number
      speed: number
      rotation: number
      rotationSpeed: number
      opacity: number
    }> = []

    // Create floating blobs
    for (let i = 0; i < 6; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 0.2,
        rotation: 0,
        rotationSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob) => {
        ctx.save()
        ctx.translate(blob.x, blob.y)
        ctx.rotate(blob.rotation)

        // Create gradient blob
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, blob.size)
        gradient.addColorStop(0, `rgba(138, 170, 229, ${blob.opacity})`)
        gradient.addColorStop(0.5, `rgba(176, 196, 222, ${blob.opacity * 0.7})`)
        gradient.addColorStop(1, `rgba(248, 187, 217, ${blob.opacity * 0.3})`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, blob.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        // Update position
        blob.y -= blob.speed
        blob.rotation += blob.rotationSpeed

        if (blob.y < -blob.size) {
          blob.y = canvas.height + blob.size
          blob.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Parallax mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xPos = (clientX / innerWidth - 0.5) * 20
      const yPos = (clientY / innerHeight - 0.5) * 20

      containerRef.current.style.transform = `translate(${xPos}px, ${yPos}px)`
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 transition-transform duration-300 ease-out"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-sora font-bold leading-tight">
                <span className="block text-1xl md:text-2xl font-normal text-opacity-80 mb-4">Hi, I'm</span>
                <span className="block pastel:text-purple-600 dark:text-blue-400 girly-blue:text-blue-500 animate-float">
                  Ayesha Afzal
                </span>
                <span
                  className="block text-3xl md:text-4xl lg:text-5xl pastel:text-pink-500 dark:text-purple-400 girly-blue:text-blue-600 animate-float mt-2"
                  style={{ animationDelay: "0.5s" }}
                >
                  Full-Stack & Mobile App Developer
                </span>
              </h1>

              <p className="text-lg md:text-xl text-opacity-80 max-w-2xl leading-relaxed">
                Passionate about building scalable full-stack apps, combining beautiful design with efficient code. I
                specialize in MERN Stack, Mobile Apps, and clean UI/UX.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <button
                onClick={scrollToProjects}
                className="group px-10 py-5 pastel:bg-gradient-to-r pastel:from-purple-500 pastel:to-pink-500 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 girly-blue:bg-gradient-to-r girly-blue:from-blue-500 girly-blue:to-indigo-500 text-white rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg font-semibold shadow-lg"
              >
                View Projects
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>

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
                className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden glass-card p-2 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <img
                  src="/AyeshaAfzal.jpeg?height=400&width=400"
                  alt="Ayesha Afzal - Full-Stack & Mobile App Developer & UI/UX Designer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Floating decorative elements */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 pastel:bg-gradient-to-br pastel:from-purple-400 pastel:to-pink-400 dark:bg-gradient-to-br dark:from-blue-500 dark:to-purple-500 girly-blue:bg-gradient-to-br girly-blue:from-blue-400 girly-blue:to-indigo-400 rounded-full opacity-20 animate-float"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute -bottom-6 -left-6 w-16 h-16 pastel:bg-gradient-to-br pastel:from-mint-400 pastel:to-sky-400 dark:bg-gradient-to-br dark:from-lime-500 dark:to-electric-500 girly-blue:bg-gradient-to-br girly-blue:from-light-blue-400 girly-blue:to-blue-400 rounded-full opacity-30 animate-float"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
