"use client"

import { useRef } from "react"
import { prefersReducedMotion } from "@/lib/utils"

interface HoverVideoProps {
  src: string
  poster?: string
  className?: string
}

export function HoverVideo({ src, poster, className }: HoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
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