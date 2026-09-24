"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/utils"

interface HoverVideoProps {
  src: string
  poster?: string
  className?: string
}

export function HoverVideo({ src, poster, className }: HoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (prefersReducedMotion()) return

    const tryPlay = () => video.play().catch(() => {})
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryPlay()
          else video.pause()
        })
      },
      { threshold: 0.2, rootMargin: "120px 0px" }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      className={className}
      onMouseEnter={(e) => {
        if (prefersReducedMotion()) return
        e.currentTarget.play().catch(() => {})
      }}
      onMouseLeave={(e) => {
        e.currentTarget.pause()
      }}
    />
  )
}