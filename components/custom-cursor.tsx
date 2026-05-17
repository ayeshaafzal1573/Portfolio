"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide default cursor on interactive items optionally or let it float alongside
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Smooth trail effect
  useEffect(() => {
    let animationFrameId: number

    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x
        const dy = position.y - prev.y
        // Adjust speed/inertia factor (0.15 is smooth and responsive)
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        }
      })
      animationFrameId = requestAnimationFrame(updateTrail)
    }

    animationFrameId = requestAnimationFrame(updateTrail)
    return () => cancelAnimationFrame(animationFrameId)
  }, [position])

  // Hover detection
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener("mouseover", handleMouseOver)
    return () => window.removeEventListener("mouseover", handleMouseOver)
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Outer soft trailing circle */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out hidden lg:block"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          background: "radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)",
          border: "1px solid rgba(217, 70, 239, 0.3)",
          transform: `translate3d(-50%, -50%, 0) scale(${isHovered ? 1.5 : 1})`,
          boxShadow: isHovered ? "0 0 15px rgba(217, 70, 239, 0.3)" : "none",
        }}
      />
      {/* Inner precise vibrant dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out hidden lg:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: "linear-gradient(135deg, #d946ef 0%, #ec4899 100%)",
          transform: `translate3d(-50%, -50%, 0) scale(${isHovered ? 0.5 : 1})`,
          boxShadow: "0 0 8px rgba(217, 70, 239, 0.8)",
        }}
      />
    </>
  )
}
