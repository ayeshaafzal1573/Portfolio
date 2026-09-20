"use client"

import { useRef } from "react"
import type { CSSProperties, ReactNode } from "react"

/* ------------------------------------------------------------------ */
/* 3D tilt card -------------------------------------------------------- */
/* Tilts toward the cursor with a radial "shine", springs back on leave. */
/* ------------------------------------------------------------------ */

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  max?: number
  scale?: number
}

export function TiltCard({ children, className = "", style, max = 12, scale = 1.03 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches))
      return
    e.stopPropagation()
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * -max * 2
    const ry = (px - 0.5) * max * 2

    el.style.transition = "transform 90ms linear, box-shadow 120ms ease"
    el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
      2
    )}deg) scale3d(${scale}, ${scale}, ${scale})`
    el.style.boxShadow = `0 24px 44px rgba(0,0,0,0.22), 0 0 0 1px var(--card-border)`
    el.style.setProperty("--tilt-x", `${px * 100}%`)
    el.style.setProperty("--tilt-y", `${py * 100}%`)
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = "transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease"
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    el.style.boxShadow = ""
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}