"use client"

import { useEffect, useRef } from "react"

/* ------------------------------------------------------------------ */
/* Subtle code-emoji hover cursor -------------------------------------- */
/* One tiny emoji that pops in only over interactive elements, none     */
/* while just moving around. Direct DOM writes, no per-frame renders.   */
/* ------------------------------------------------------------------ */

const INTERACTIVE =
  "a,button,input,textarea,select,[role=button],[class*=btn],.chip,.nav-link,.tilt-card,.social-link,.card,.cursor-pointer"

function pickEmoji(el: Element): string {
  const cls = el.className || ""
  const tag = el.tagName.toLowerCase()
  if (tag === "a" || cls.includes("nav-link") || cls.includes("social")) return "🚀"
  if (tag === "button" || cls.includes("btn")) return "⚡"
  if (cls.includes("chip")) return "🧩"
  if (cls.includes("tilt-card") || cls.includes("card") || tag === "article") return "✨"
  if (tag === "input" || tag === "textarea" || tag === "select") return "🧠"
  return "✨"
}

export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let curX = targetX
    let curY = targetY
    let raf = 0
    let running = false
    let settled = 0
    let visible = false

    const setVisible = (v: boolean) => {
      if (visible === v) return
      visible = v
      wrap.classList.toggle("hovering", v)
      if (v && !running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(INTERACTIVE)
      if (el) {
        wrap.querySelector("span")!.textContent = pickEmoji(el)
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    const loop = () => {
      curX += (targetX - curX) * 0.4
      curY += (targetY - curY) * 0.4
      wrap.style.transform = `translate3d(${curX + 12}px, ${curY - 24}px, 0)`
      if (Math.hypot(curX - targetX, curY - targetY) < 1.5) settled += 1
      else settled = 0
      if (!visible && settled > 4) {
        running = false
        return
      }
      raf = requestAnimationFrame(loop)
    }

    const move = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!running && visible) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    window.addEventListener("mouseover", over, { passive: true })
    window.addEventListener("mousemove", move, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mouseover", over)
      window.removeEventListener("mousemove", move)
    }
  }, [])

  return (
    <div ref={wrapRef} className="cursor-emoji-wrap" aria-hidden="true">
      <span className="cursor-emoji-main">🚀</span>
    </div>
  )
}