"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties, ReactNode } from "react"

/* ------------------------------------------------------------------ */
/* Shared 3D-scroll driver --------------------------------------------- */
/* Transforms are computed lazily: on scroll/resize/config updates only, */
/* never in a permanent rAF loop.                                        */
/* ------------------------------------------------------------------ */

interface ScrollDepthEntry {
  el: HTMLElement
  tilt: number
  depth: number
  fade: boolean
}

const registry = new Set<ScrollDepthEntry>()
let raf: number | null = null
let scheduled = false
let bound = false
let reducedMotion: boolean | null = null

function prefersReduced() {
  if (reducedMotion !== null) return reducedMotion
  reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return reducedMotion
}

function update() {
  if (prefersReduced()) return
  const vh = window.innerHeight || 1
  registry.forEach((entry) => {
    const { el, tilt, depth, fade } = entry
    const rect = el.getBoundingClientRect()
    if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) {
      if (el.style.willChange !== "auto") el.style.willChange = "auto"
      return
    }
    const h = rect.height || vh
    const center = rect.top + h / 2
    const denom = vh / 2 + h / 2
    const off = Math.max(-1, Math.min(1, (center - vh / 2) / (denom || 1)))

    if (el.style.willChange !== "transform") el.style.willChange = "transform, opacity"

    const absOff = Math.abs(off)
    const rotX = off * tilt
    const z = (1 - absOff) * depth
    const scale = 1 + Math.sin((1 - absOff) * Math.PI * 0.5) * 0.018

    el.style.transform = `perspective(1500px) rotateX(${rotX.toFixed(2)}deg) translateZ(${z.toFixed(
      1
    )}px) scale(${scale.toFixed(4)})`

    if (fade) {
      const fadeMag = Math.max(0, absOff - 0.6) / 0.4
      el.style.opacity = (1 - fadeMag).toFixed(3)
    }
  })
}

function requestUpdate() {
  if (scheduled) return
  scheduled = true
  if (raf !== null) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    scheduled = false
    raf = null
    update()
  })
}

function ensureBound() {
  if (bound || typeof window === "undefined" || prefersReduced()) return
  bound = true
  window.addEventListener("scroll", requestUpdate, { passive: true })
  window.addEventListener("resize", requestUpdate)
  window.addEventListener("load", requestUpdate)
  window.addEventListener("portfolioConfigUpdated", requestUpdate)
  requestUpdate()
}

function unbindIfEmpty() {
  if (registry.size === 0 && bound) {
    bound = false
    window.removeEventListener("scroll", requestUpdate)
    window.removeEventListener("resize", requestUpdate)
    window.removeEventListener("load", requestUpdate)
    window.removeEventListener("portfolioConfigUpdated", requestUpdate)
  }
}

/* ------------------------------------------------------------------ */
/* ScrollDepth wrapper -------------------------------------------------- */
/* ------------------------------------------------------------------ */

interface ScrollDepthProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  tilt?: number
  depth?: number
  fade?: boolean
}

export function ScrollDepth({
  children,
  className,
  style,
  tilt = 18,
  depth = 130,
  fade = true,
}: ScrollDepthProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) return
    el.style.transformStyle = "preserve-3d"
    const entry: ScrollDepthEntry = { el, tilt, depth, fade }
    registry.add(entry)
    ensureBound()
    requestUpdate()
    return () => {
      registry.delete(entry)
      unbindIfEmpty()
    }
  }, [tilt, depth, fade])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}