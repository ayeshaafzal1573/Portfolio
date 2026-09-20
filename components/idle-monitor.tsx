"use client"

import { useEffect } from "react"

/* ------------------------------------------------------------------ */
/* Throttles decorative CSS animations (blobs, floaters, glows) while  */
/* the page is idle, then restores them on the next interaction.        */
/* ------------------------------------------------------------------ */

const IDLE_MS = 2600
const WATCH = ["scroll", "mousemove", "touchstart", "pointerdown", "keydown", "resize"]

export function IdleMonitor() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const deactivate = () => document.body.classList.add("is-idle")
    const activate = () => {
      document.body.classList.remove("is-idle")
      if (timer) clearTimeout(timer)
      timer = setTimeout(deactivate, IDLE_MS)
    }
    activate()
    WATCH.forEach((ev) => window.addEventListener(ev, activate, { passive: true }))
    return () => {
      WATCH.forEach((ev) => window.removeEventListener(ev, activate))
      if (timer) clearTimeout(timer)
      document.body.classList.remove("is-idle")
    }
  }, [])
  return null
}