"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { buildDevices, readThemeColor, easeOutExpo, clamp01, makeSlideTexture, type SlideProject } from "./devices-models"
import { createVideoCache } from "./media-textures"
import { useCategorizedProjects } from "@/lib/useConfig"

/* ------------------------------------------------------------------ */
/* Cinematic page-open intro: MacBook + phone fly into frame, real     */
/* project videos cycle inside the screens, then the overlay fades     */
/* to reveal the portfolio. Tappable to skip.                          */
/* ------------------------------------------------------------------ */

const INTRO_MS = 3500
const FADE_MS = 650
const MEDIA_START = 1100
const MEDIA_GAP = 1300
const SPARKLE_COUNT = 90

export function DeviceIntro() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<"live" | "fading" | "gone">("live")

  const { data: projectsData } = useCategorizedProjects()
  const projectsRef = useRef<SlideProject[] | null>(null)
  projectsRef.current =
    projectsData?.map((p) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      tech_stack: p.tech_stack,
      image_url: p.image_url,
      video_url: p.video_url,
    })) ?? null

  /* Skip instantly for reduced-motion users */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone")
    }
  }, [])

  /* Fully unmount the overlay after the CSS fade so it can never block the page */
  useEffect(() => {
    if (phase !== "fading") return
    const t = window.setTimeout(() => setPhase("gone"), FADE_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== "live" || !canvasRef.current) return
    const canvas = canvasRef.current

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
    } catch {
      setPhase("gone")
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 60)
    camera.position.set(0, 2.1, 3.4)

    const primary = readThemeColor("--accent-primary")
    const secondary = readThemeColor("--accent-secondary")
    const build = buildDevices(primary, secondary)
    build.group.scale.setScalar(0.12)
    scene.add(build.group)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x24160a, 0.75)
    const key = new THREE.DirectionalLight(0xfff3e2, 2.6)
    key.position.set(4, 6, 5)
    const accA = new THREE.PointLight(primary, 16, 0, 2)
    accA.position.set(-4, 2.4, 3)
    const accB = new THREE.PointLight(secondary, 15, 0, 2)
    accB.position.set(4.4, 1.2, -3)
    scene.add(hemi, key, accA, accB)

    const spPos = new Float32Array(SPARKLE_COUNT * 3)
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      spPos[i * 3] = (Math.random() - 0.5) * 9
      spPos[i * 3 + 1] = (Math.random() - 0.3) * 6
      spPos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    const spGeo = new THREE.BufferGeometry()
    spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3))
    const spMat = new THREE.PointsMaterial({
      color: primary,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const sparkles = new THREE.Points(spGeo, spMat)
    scene.add(sparkles)

    const lookTarget = new THREE.Vector3(0, 0.3, 0)
    const zero = performance.now()
    let rafId = 0
    let fadeStarted = false
    let fadeZero = 0
    let disposed = false

    /* Real project videos / slides cycle inside the devices ----------- */
    const mediaCache = createVideoCache()
    let mediaToken = 0
    let nextMediaAt = zero + MEDIA_START
    let mediaIndex = 0

    const assignScreen = (mesh: THREE.Mesh, tex: THREE.Texture) => {
      const mat = mesh.material as THREE.MeshBasicMaterial
      const old = mat.map
      if (old && !old.userData?.shared) old.dispose()
      mat.map = tex
      mat.needsUpdate = true
    }

    const showProject = async (project: SlideProject | null, token: number) => {
      const url = project?.video_url?.trim()
      if (url) {
        const vt = await mediaCache.get(url)
        if (disposed || token !== mediaToken) return
        if (vt) {
          assignScreen(build.laptopScreen, vt)
          assignScreen(build.phoneScreen, vt)
          return
        }
      }
      const p = readThemeColor("--accent-primary")
      const s = readThemeColor("--accent-secondary")
      const [lt, pt] = await Promise.all([
        makeSlideTexture("laptop", project, p, s),
        makeSlideTexture("phone", project, p, s),
      ])
      if (disposed || token !== mediaToken) {
        lt.dispose()
        pt.dispose()
        return
      }
      assignScreen(build.laptopScreen, lt)
      assignScreen(build.phoneScreen, pt)
    }

    const fadeOverlay = () => {
      if (fadeStarted || disposed) return
      fadeStarted = true
      fadeZero = performance.now()
      setPhase("fading")
    }

    const skip = () => fadeOverlay()
    wrapRef.current?.style.setProperty("cursor", "pointer")
    canvas.addEventListener("click", skip)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") fadeOverlay()
    }
    window.addEventListener("keydown", onKey)

    const fadeTimer = window.setTimeout(fadeOverlay, INTRO_MS)

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
    }
    resize()
    window.addEventListener("resize", resize)

    function animate(now: number) {
      if (disposed) return
      const t = (now - zero) / 1000
      const k = easeOutExpo(clamp01(t / (INTRO_MS / 1000)))
      const back = easeOutExpo(clamp01((now - (zero + INTRO_MS * 0.45)) / 900))

      build.group.scale.setScalar(0.12 + (1 - 0.12) * k)
      build.group.rotation.y = (1 - k) * -0.9 + Math.sin(t * 0.7) * 0.06
      build.group.position.y = (1 - k) * -0.7 + Math.sin(t * 0.5) * 0.03

      camera.position.set(
        (1 - back) * -0.5,
        2.1 - (2.1 - 1.05) * k,
        3.4 + (5.2 - 3.4) * k
      )
      camera.lookAt(lookTarget)

      const att = spGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < SPARKLE_COUNT; i++) {
        let y = att.getY(i) + (0.15 + (i % 5) * 0.05) * 0.02
        if (y > 3.6) y = -2.4
        att.setY(i, y)
      }
      att.needsUpdate = true
      sparkles.rotation.z = t * 0.04

      if (now >= nextMediaAt && !fadeStarted) {
        const projects = projectsRef.current
        if (projects && projects.length > 0) {
          const project = projects[mediaIndex % projects.length]
          mediaIndex += 1
          const token = ++mediaToken
          nextMediaAt = now + MEDIA_GAP
          showProject(project, token).catch(() => {})
        } else {
          nextMediaAt = now + MEDIA_GAP
        }
      }

      renderer.render(scene, camera)
      if (fadeStarted && now - fadeZero > FADE_MS) {
        disposed = true
        cancelAnimationFrame(rafId)
        setPhase("gone")
        return
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(fadeTimer)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("click", skip)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose?.()
          const m = Array.isArray(obj.material) ? obj.material : [obj.material]
          for (const mm of m) mm.dispose?.()
        }
      })
      for (const m of [hemi, key, accA, accB, spMat]) m.dispose?.()
      for (const d of build.disposables) d.dispose()
      mediaCache.disposeAll()
      spGeo.dispose()
      renderer.dispose()
    }
  }, [phase])

  /* CSS fade-out on the "fading" phase */
  let overlayStyle: React.CSSProperties = {
    transition: `opacity ${FADE_MS}ms ease`,
    opacity: 1,
  }
  if (phase === "fading") overlayStyle = { ...overlayStyle, opacity: 0 }

  if (phase === "gone") return null

  return (
    <div
      ref={wrapRef}
      style={{
        ...overlayStyle,
        background: "var(--bg-primary)",
        pointerEvents: phase === "live" ? "auto" : "none",
      }}
      className="fixed inset-0 z-[200]"
      role="presentation"
      aria-hidden="true"
    >
      {/* radial accent glows to frame the devices */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side at 30% 40%, color-mix(in srgb, var(--accent-primary) 22%, transparent), transparent 70%), radial-gradient(closest-side at 72% 55%, color-mix(in srgb, var(--accent-secondary) 20%, transparent), transparent 70%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <span className="rounded-full glass-card px-4 py-2 text-xs font-semibold text-[color:var(--text-secondary)]">
          One engineer · Web &amp; Mobile
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-24 text-center w-full text-[11px] uppercase tracking-[0.3em] text-[color:var(--text-secondary)]/70">
        tap to skip
      </div>
    </div>
  )
}