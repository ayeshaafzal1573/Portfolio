"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

/* ------------------------------------------------------------------ */
/* Helpers ------------------------------------------------------------- */
/* ------------------------------------------------------------------ */

function readThemeColor(name: string): string {
  if (typeof document === "undefined") return "#d946ef"
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#d946ef"
}

/* ------------------------------------------------------------------ */
/* Vanilla three.js scene (no react-reconciler, no fiber) ----------------- */
/* ------------------------------------------------------------------ */

const STAR_COUNT = 420

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const frame = requestAnimationFrame(() => setEnabled(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!enabled || !canvasRef.current) return

    const canvas = canvasRef.current
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 240)
    camera.position.set(0, 0, 8)

    /* Lights ----------------------------------------------------------- */
    const ambient = new THREE.AmbientLight(0xffffff, 0.65)
    const lightA = new THREE.PointLight(0xa855f7, 150, 0, 2)
    lightA.position.set(8, 6, 6)
    const lightB = new THREE.PointLight(0xd946ef, 140, 0, 2)
    lightB.position.set(-8, -6, 4)
    scene.add(ambient, lightA, lightB)

    /* Starfield --------------------------------------------------------- */
    const starPositions = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 0.026
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight * 0.04
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 160
    }
    const starColors = new Float32Array(STAR_COUNT * 3)
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3))
    const starMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    /* Drifting 3D shapes ------------------------------------------------- */
    const shapeGeometries = [
      new THREE.TorusKnotGeometry(0.9, 0.3, 64, 8),
      new THREE.IcosahedronGeometry(0.9, 0),
      new THREE.DodecahedronGeometry(0.9),
      new THREE.TorusGeometry(1, 0.4, 10, 24),
      new THREE.OctahedronGeometry(0.9),
      new THREE.SphereGeometry(0.85, 12, 12),
      new THREE.TorusGeometry(0.7, 0.28, 8, 20),
    ]

    interface Shape {
      mesh: THREE.Mesh
      material: THREE.MeshStandardMaterial
      seed: number
      scale: number
      offsetX: number
      offsetY: number
      offsetZ: number
      usesPrimary: boolean
    }

    const shapes: Shape[] = []
    const SHAPE_COUNT = 7
    for (let i = 0; i < SHAPE_COUNT; i++) {
      const usesPrimary = i % 2 === 0
      const material = new THREE.MeshStandardMaterial({
        wireframe: i % 7 === 0,
        metalness: i % 3 === 0 ? 0.72 : 0.18,
        roughness: i % 3 === 0 ? 0.2 : 0.45,
        transparent: true,
        opacity: i % 3 === 0 ? 0.5 : i % 4 === 0 ? 0.3 : 0.42,
        emissiveIntensity: 0.18,
      })
      const mesh = new THREE.Mesh(shapeGeometries[i % shapeGeometries.length], material)
      scene.add(mesh)
      shapes.push({
        mesh,
        material,
        seed: i * 0.618,
        scale: 0.45 + (i % 4) * 0.32,
        offsetX: (i / SHAPE_COUNT - 0.5) * window.innerWidth * 0.019,
        offsetY: (i % 7) * 2.5 - 7.2,
        offsetZ: -10 - (i % 5) * 26,
        usesPrimary,
      })
    }

    /* Scroll / mouse / resize state --------------------------------------- */
    let scroll = 0
    let scrollMax = 1
    const measureScrollMax = () => {
      scrollMax = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      )
    }
    const mouse = { x: 0, y: 0 }
    let lastInteraction = performance.now()
    let hidden = typeof document !== "undefined" && document.hidden
    let rafId = 0
    let running = false
    let lastRender = 0
    let renderSuppressedUntil = 0

    const touch = () => {
      lastInteraction = performance.now()
      ensureRunning()
    }
    const onScroll = () => {
      scroll = window.scrollY / scrollMax
      renderSuppressedUntil = performance.now() + 150
      touch()
    }
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      touch()
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      measureScrollMax()
      touch()
    }
    const onVisibility = () => {
      hidden = document.hidden
      if (hidden) {
        if (running) {
          running = false
          cancelAnimationFrame(rafId)
        }
      } else {
        ensureRunning()
      }
    }
    onScroll()
    onResize()
    const loadReMeasure = () => measureScrollMax()
    window.addEventListener("load", loadReMeasure)
    window.addEventListener("portfolioConfigUpdated", loadReMeasure)

    /* Theme reactivity ----------------------------------------------------- */
    const applyTheme = () => {
      const primary = readThemeColor("--accent-primary")
      const secondary = readThemeColor("--accent-secondary")
      lightA.color.set(secondary)
      lightB.color.set(primary)
      const p = new THREE.Color(primary)
      const s = new THREE.Color(secondary)
      const neutral = new THREE.Color("#c3c9ff")
      for (let i = 0; i < STAR_COUNT; i++) {
        const pick = i % 3 === 0 ? p : i % 3 === 1 ? s : neutral
        starColors[i * 3] = pick.r
        starColors[i * 3 + 1] = pick.g
        starColors[i * 3 + 2] = pick.b
      }
      starGeometry.attributes.color.needsUpdate = true
      for (const shape of shapes) {
        shape.material.color.set(shape.usesPrimary ? primary : secondary)
        shape.material.emissive.set(shape.usesPrimary ? primary : secondary)
      }
    }
    applyTheme()
    const themeObserver = new MutationObserver(applyTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    /* Animation loop ---------------------------------------------------------
       Renders every frame while interacting (~24fps during the idle tail),
       then stops requesting frames entirely. `hidden` pauses it outright.    */
    const IDLE_MS = 2400
    const STEP_MS = 24

    function animate(now: number) {
      if (now - lastInteraction > IDLE_MS || hidden) {
        running = false
        return
      }
      if (now >= renderSuppressedUntil && now - lastRender >= STEP_MS) {
        const t = now / 1000
        lastRender = now

        camera.position.z = 8 + Math.sin(t * 0.3) * 0.35
        camera.position.x = mouse.x * 0.4
        camera.position.y = mouse.y * 0.25 - scroll * 0.4
        camera.rotation.y = mouse.x * 0.07 + scroll * 0.08
        camera.rotation.x = -mouse.y * 0.05
        camera.lookAt(0, 0, 0)

        stars.rotation.z = t * 0.012 + scroll * 0.35
        stars.rotation.x = t * 0.006 + mouse.y * 0.12
        stars.rotation.y = scroll * 0.9 + mouse.x * 0.15
        starMaterial.opacity = 0.55 + scroll * 0.3

        for (let i = 0; i < shapes.length; i++) {
          const s = shapes[i]
          const driftY = Math.sin(t * 0.12 + s.seed * 6) * 7 + Math.sin(t * 0.07 + s.seed * 13) * 11
          const driftX = Math.sin(t * 0.16 + s.seed * 20) * 8
          s.mesh.position.set(
            s.offsetX + driftX + mouse.x * 12 * (1 + (i % 10) * 0.06) - scroll * 24,
            s.offsetY + driftY + mouse.y * 6 + scroll * 95,
            s.offsetZ + mouse.y * 30 + scroll * 26
          )
          s.mesh.rotation.x = Math.sin(t * 0.2 + s.seed * 6) * 0.6 - scroll * 0.9
          s.mesh.rotation.y = t * 0.1 * (0.6 + s.seed) + scroll * 0.8
          s.mesh.scale.setScalar(s.scale + Math.sin(t * 0.5 + s.seed) * 0.06)
        }

        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(animate)
    }

    function ensureRunning() {
      if (!running && !document.hidden) {
        running = true
        rafId = requestAnimationFrame(animate)
      }
    }
    ensureRunning()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("load", loadReMeasure)
      window.removeEventListener("portfolioConfigUpdated", loadReMeasure)
      themeObserver.disconnect()
      starGeometry.dispose()
      starMaterial.dispose()
      for (const shape of shapes) {
        shape.mesh.geometry.dispose()
        shape.material.dispose()
      }
      shapeGeometries.forEach((g) => g.dispose())
      renderer.dispose()
    }
  }, [enabled])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}