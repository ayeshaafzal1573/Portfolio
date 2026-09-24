"use client"

import { useEffect, useRef } from "react"

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

    let inView = false
    const tryPlay = () => {
      const p = video.play()
      if (p) p.catch(() => {})
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting
          if (inView) tryPlay()
          else video.pause()
        })
      },
      { threshold: 0.2, rootMargin: "140px 0px" }
    )
    io.observe(video)

    // If the first play() raced the file still loading, retry as soon as data is ready.
    const onReady = () => {
      if (inView) tryPlay()
    }
    video.addEventListener("canplay", onReady)
    video.addEventListener("loadeddata", onReady)

    return () => {
      io.disconnect()
      video.removeEventListener("canplay", onReady)
      video.removeEventListener("loadeddata", onReady)
    }
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
        e.currentTarget.play().catch(() => {})
      }}
      onMouseLeave={(e) => {
        e.currentTarget.pause()
      }}
    />
  )
}