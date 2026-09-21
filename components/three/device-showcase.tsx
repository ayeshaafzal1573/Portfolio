"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Layers, Smartphone, Globe, Zap, AppWindow, Move3d } from "lucide-react"
import { useCategorizedProjects } from "@/lib/useConfig"
import {
  buildDevices,
  readThemeColor,
  easeOutExpo,
  clamp01,
  makeSlideTexture,
  type SlideProject,
} from "./devices-models"
import { createVideoCache } from "./media-textures"

/* ------------------------------------------------------------------ */
/* Interactive 3D showcase:                                              */
/*  - Drag to orbit, scroll to zoom (OrbitControls)                     */
/*  - Real portfolio projects cycle inside the MacBook + phone screens  */
/*  - Cinematic assemble intro on scroll-in + idle auto-rotate          */
/* ------------------------------------------------------------------ */

const INTRO_DURATION = 2.0
const SLIDE_MS = 4200
const FADE_MS = 800
const SPARKLE_COUNT = 130
const RING_COUNT = 3
const DOTS_PER_RING = 14

interface ScreenSlots {
  a: THREE.Mesh
  b: THREE.Mesh
  cur: number
}

export function DeviceShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current || !cardRef.current) return
    const canvas = canvasRef.current
    const card = cardRef.current

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60)
    const target = new THREE.Vector3(0, 0.35, 0)
    camera.position.set(0, 2.2, 8.2)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(target)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 3.2
    controls.maxDistance = 9.5
    controls.minPolarAngle = 0.4
    controls.maxPolarAngle = Math.PI / 2 - 0.06
    controls.minAzimuthAngle = -1.7
    controls.maxAzimuthAngle = 1.7
    controls.autoRotateSpeed = 0.55
    controls.enabled = false

    const primary = readThemeColor("--accent-primary")
    const secondary = readThemeColor("--accent-secondary")
    const build = buildDevices(primary, secondary)
    scene.add(build.group)

    /* Lights ----------------------------------------------------------- */
    const hemi = new THREE.HemisphereLight(0xffffff, 0x2a1d12, 0.6)
    const key = new THREE.DirectionalLight(0xfff3e2, 2.2)
    key.position.set(4, 6, 5)
    const rim = new THREE.DirectionalLight(0xc8d0ff, 0.9)
    rim.position.set(-4, 3, -5)
    const accA = new THREE.PointLight(primary, 14, 0, 2)
    accA.position.set(-4.5, 2.6, 3.2)
    const accB = new THREE.PointLight(secondary, 13, 0, 2)
    accB.position.set(4.6, 1.4, -3)
    scene.add(hemi, key, rim, accA, accB)

    /* Ambient orbs ------------------------------------------------------ */
    const orbMat = new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.05, depthWrite: false })
    const orb = new THREE.Mesh(new THREE.SphereGeometry(3.4, 24, 16), orbMat)
    orb.position.set(-1, 0.4, -2.6)
    scene.add(orb)
    const orbMatB = orbMat.clone()
    orbMatB.color.set(secondary)
    const orbB = new THREE.Mesh(new THREE.SphereGeometry(2.9, 24, 16), orbMatB)
    orbB.position.set(1.4, 0.2, -2.8)
    scene.add(orbB)

    /* Sparkles ---------------------------------------------------------- */
    const spPos = new Float32Array(SPARKLE_COUNT * 3)
    const spBase = new Float32Array(SPARKLE_COUNT)
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      spPos[i * 3] = (Math.random() - 0.5) * 7
      spPos[i * 3 + 1] = (Math.random() - 0.2) * 5
      spPos[i * 3 + 2] = (Math.random() - 0.5) * 5
      spBase[i] = 0.15 + Math.random() * 0.3
    }
    const spGeo = new THREE.BufferGeometry()
    spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3))
    const spMat = new THREE.PointsMaterial({
      color: primary,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const sparkles = new THREE.Points(spGeo, spMat)
    scene.add(sparkles)

    /* Orbiting tech-dots rings ----------------------------------------- */
    interface DotRing { dots: THREE.Mesh[]; radius: number; speed: number; tilt: number; y: number }
    const rings: DotRing[] = []
    const ringMats: THREE.MeshBasicMaterial[] = []
    for (let r = 0; r < RING_COUNT; r++) {
      const radius = 2.6 + r * 0.55
      const dotMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? primary : secondary,
        transparent: true,
        opacity: 0.16 + r * 0.05,
        depthWrite: false,
      })
      const dots: THREE.Mesh[] = []
      for (let d = 0; d < DOTS_PER_RING; d++) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045 + r * 0.008, 10, 8), dotMat)
        scene.add(dot)
        dots.push(dot)
      }
      ringMats.push(dotMat)
      rings.push({ dots, radius, speed: 0.1 + r * 0.07, tilt: (r - 1) * 0.35, y: 0.35 + (r - 1) * 0.2 })
    }

    /* Screen slide engine (laptop + phone share the same project) ------ */
    const screenLaptop: ScreenSlots = { a: null!, b: null!, cur: 0 }
    const screenPhone: ScreenSlots = { a: null!, b: null!, cur: 0 }

    const wireScreen = (
      screen: ScreenSlots,
      host: THREE.Object3D,
      screenMesh: THREE.Mesh,
      zA: number,
      zB: number
    ) => {
      const make = (z: number) => {
        const mesh = new THREE.Mesh(
          screenMesh.geometry.clone(),
          new THREE.MeshBasicMaterial({ map: null, transparent: true, opacity: 0, depthWrite: false })
        )
        mesh.position.copy(screenMesh.position)
        mesh.position.z = z
        mesh.rotation.copy(screenMesh.rotation)
        mesh.renderOrder = 2
        return mesh
      }
      screen.a = make(zA)
      screen.b = make(zB)
      host.add(screen.a, screen.b)
    }
    wireScreen(screenLaptop, build.laptopScreenHost, build.laptopScreen, 0.027, 0.035)
    wireScreen(screenPhone, build.phoneScreenHost, build.phoneScreen, 0.0435, 0.052)
    // hide the original static screen meshes
    build.laptopScreen.visible = false
    build.phoneScreen.visible = false

    const slotMeshes = (screen: ScreenSlots) => (screen.cur === 0 ? screen.a : screen.b)
    const otherMeshes = (screen: ScreenSlots) => (screen.cur === 0 ? screen.b : screen.a)

    let buildToken = 0
    let nextFlash = -1
    let fadeT0 = 0
    let nextSlideAt = 0
    const indexRef = { value: -1 }
    let ready = false

    /* Video textures (shared between both screens, cached by URL) ------ */
    const videoCache = createVideoCache()
    let activeVideo: HTMLVideoElement | null = null
    let pendingVideo: HTMLVideoElement | null = null

    const assignMap = (mesh: THREE.Mesh, tex: THREE.Texture) => {
      const mat = mesh.material as THREE.MeshBasicMaterial
      const old = mat.map
      if (old && !old.userData?.shared) old.dispose()
      mat.map = tex
      mat.needsUpdate = true
    }

    const applyTransition = (laptopTex: THREE.Texture, phoneTex: THREE.Texture, video: HTMLVideoElement | null) => {
      assignMap(otherMeshes(screenLaptop), laptopTex)
      assignMap(otherMeshes(screenPhone), phoneTex)
      ;(otherMeshes(screenLaptop).material as THREE.MeshBasicMaterial).opacity = 0
      ;(otherMeshes(screenPhone).material as THREE.MeshBasicMaterial).opacity = 0
      pendingVideo = video
      nextFlash = buildToken
      fadeT0 = performance.now()
    }

    const buildCanvasSlide = (project: SlideProject | null, token: number) => {
      const p = readThemeColor("--accent-primary")
      const s = readThemeColor("--accent-secondary")
      const lp = makeSlideTexture("laptop", project, p, s)
      const pp = makeSlideTexture("phone", project, p, s)
      Promise.all([lp, pp])
        .then(([lt, pt]) => {
          if (token !== buildToken) {
            lt.dispose()
            pt.dispose()
            return
          }
          applyTransition(lt, pt, null)
        })
        .catch(() => {})
    }

    const commitSlide = (project: SlideProject | null) => {
      const token = ++buildToken
      const url = project?.video_url?.trim()
      if (url) {
        videoCache.get(url).then((vt) => {
          if (token !== buildToken) return
          if (vt) {
            const entry = videoCache.getEntry(url)
            applyTransition(vt, vt, entry?.video ?? null)
          } else {
            buildCanvasSlide(project, token)
          }
        })
      } else {
        buildCanvasSlide(project, token)
      }
    }

    const bootSlides = () => {
      ready = true
      const lp = makeSlideTexture("laptop", null, primary, secondary)
      const pp = makeSlideTexture("phone", null, primary, secondary)
      Promise.all([lp, pp]).then(([lt, pt]) => {
        if (disposed) {
          lt.dispose()
          pt.dispose()
          return
        }
        assignMap(screenLaptop.a, lt)
        assignMap(screenPhone.a, pt)
        ;(screenLaptop.a.material as THREE.MeshBasicMaterial).opacity = 1
        ;(screenPhone.a.material as THREE.MeshBasicMaterial).opacity = 1
      })
    }

    const scheduleSlide = () => {
      if (!ready || !projectsRef.current?.length) return
      indexRef.value = (indexRef.value + 1) % projectsRef.current.length
      commitSlide(projectsRef.current[indexRef.value])
    }

    /* State ------------------------------------------------------------- */
    let visible = false
    let started = false
    let introZero = 0
    let introDone = false
    let scrollProg = 0
    let rafId = 0
    let running = false
    let lastRender = 0
    let disposed = false

    const onScroll = () => {
      const rect = card.getBoundingClientRect()
      const vh = window.innerHeight
      scrollProg = clamp01((vh * 0.7 - rect.top) / (vh * 0.7 + rect.height * 0.4))
    }

    const onControlsStart = () => {
      controls.autoRotate = false
      if (hintRef.current) hintRef.current.style.opacity = "0"
    }
    controls.addEventListener("start", onControlsStart)

    function animate(now: number) {
      if (disposed) return
      if (now - lastRender >= 16) {
        lastRender = now
        const t = now / 1000

        if (started && !introDone) {
          const e = easeOutExpo(clamp01((now - introZero) / 1000 / INTRO_DURATION))
          camera.position.set(
            0 * (1 - e),
            (2.2 - (2.2 - 1.35) * e),
            8.2 - (8.2 - 5.4) * e
          )
          camera.lookAt(target)
          if (e >= 1) {
            introDone = true
            controls.enabled = true
            controls.autoRotate = true
          }
        } else if (introDone) {
          controls.update()
        }

        const g = build.group
        g.position.y = Math.sin(t * 0.55) * 0.045
        g.rotation.y = Math.sin(t * 0.24) * 0.09 + scrollProg * 0.6
        g.scale.setScalar(1)

        build.phone.position.y = 0.34 + Math.sin(t * 0.9) * 0.045
        build.phone.rotation.z = Math.sin(t * 0.7) * 0.03
        build.laptop.rotation.z = Math.sin(t * 0.6) * 0.012

        /* Slide crossfade with hold */
        if (ready) {
          if (nextFlash === buildToken) {
            const k = clamp01((now - fadeT0) / FADE_MS)
            if (k < 1) {
              const e = Math.sin((k * Math.PI) / 2)
              ;(otherMeshes(screenLaptop).material as THREE.MeshBasicMaterial).opacity = e
              ;(otherMeshes(screenPhone).material as THREE.MeshBasicMaterial).opacity = e
            } else {
              screenLaptop.cur = screenLaptop.cur === 0 ? 1 : 0
              screenPhone.cur = screenPhone.cur === 0 ? 1 : 0
              ;(slotMeshes(screenLaptop).material as THREE.MeshBasicMaterial).opacity = 1
              ;(slotMeshes(screenPhone).material as THREE.MeshBasicMaterial).opacity = 1
              if (activeVideo && activeVideo !== pendingVideo) activeVideo.pause()
              activeVideo = pendingVideo
              nextFlash = -1
              nextSlideAt = now + SLIDE_MS
            }
          } else if (now >= nextSlideAt) {
            nextSlideAt = Infinity
            scheduleSlide()
          }
        }

        orbMat.opacity = 0.05 + Math.sin(t * 0.8) * 0.022
        orbMatB.opacity = 0.05 + Math.sin(t * 0.65) * 0.02
        orb.position.x = -1 + Math.sin(t * 0.3) * 0.3
        orbB.position.x = 1.4 + Math.cos(t * 0.26) * 0.3

        const att = spGeo.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < SPARKLE_COUNT; i++) {
          let y = att.getY(i) + spBase[i] * 0.016
          if (y > 3.4) y = -1.6
          att.setY(i, y)
        }
        att.needsUpdate = true
        sparkles.rotation.y = t * 0.05

        for (let r = 0; r < rings.length; r++) {
          const ring = rings[r]
          for (let d = 0; d < DOTS_PER_RING; d++) {
            const dot = ring.dots[d]
            const ang = (d / DOTS_PER_RING) * Math.PI * 2 + t * ring.speed
            dot.position.set(
              Math.cos(ang) * ring.radius + Math.sin(t * 0.4 + r + d) * 0.12,
              ring.y + Math.sin(ang * 2 + t) * 0.1,
              Math.sin(ang) * ring.radius * 0.85
            )
          }
        }

        renderer.render(scene, camera)
      }
      if (visible) rafId = requestAnimationFrame(animate)
      else running = false
    }

    const ensureRunning = () => {
      if (!running && visible && !disposed && !document.hidden) {
        running = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting
          if (visible) {
            if (!started) {
              started = true
              introZero = performance.now()
              bootSlides()
              nextSlideAt = performance.now() + SLIDE_MS
            }
            onScroll()
            ensureRunning()
          } else {
            running = false
            if (rafId) cancelAnimationFrame(rafId)
          }
        }
      },
      { threshold: 0.05 }
    )
    io.observe(card)

    const resize = () => {
      const w = card.clientWidth
      const h = card.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(card)
    resize()

    /* Theme reactivity: update lights + redraw the visible slide --------- */
    const applyTheme = () => {
      const p = readThemeColor("--accent-primary")
      const s = readThemeColor("--accent-secondary")
      accA.color.set(p)
      accB.color.set(s)
      orbMat.color.set(p)
      orbMatB.color.set(s)
      spMat.color.set(p)
      for (let r = 0; r < rings.length; r++) ringMats[r].color.set(r % 2 === 0 ? p : s)
      if (ready) {
        const project = projectsRef.current && projectsRef.current.length ? projectsRef.current[indexRef.value] : null
        if (project?.video_url?.trim()) return
        const token = ++buildToken
        const lp = makeSlideTexture("laptop", project, p, s)
        const pp = makeSlideTexture("phone", project, p, s)
        Promise.all([lp, pp]).then(([lt, pt]) => {
          if (token !== buildToken) {
            lt.dispose()
            pt.dispose()
            return
          }
          assignMap(slotMeshes(screenLaptop), lt)
          assignMap(slotMeshes(screenPhone), pt)
        })
      }
    }
    const themeObserver = new MutationObserver(applyTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    window.addEventListener("scroll", onScroll, { passive: true })
    const visHandler = () => {
      if (document.hidden) {
        running = false
        if (rafId) cancelAnimationFrame(rafId)
      } else ensureRunning()
    }
    document.addEventListener("visibilitychange", visHandler)
    onScroll()

    return () => {
      disposed = true
      buildToken++
      running = false
      cancelAnimationFrame(rafId)
      io.disconnect()
      ro.disconnect()
      themeObserver.disconnect()
      controls.removeEventListener("start", onControlsStart)
      controls.dispose()
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", visHandler)

      const extra = [orbMat, orbMatB, spMat, ...ringMats]
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj === build.laptopScreen || obj === build.phoneScreen) return
          obj.geometry?.dispose?.()
          const m = Array.isArray(obj.material) ? obj.material : [obj.material]
          for (const mm of m) {
            if (mm instanceof THREE.MeshBasicMaterial && mm.map) mm.map.dispose()
            mm.dispose?.()
          }
        }
      })
      for (const m of extra) m.dispose?.()
      for (const d of build.disposables) d.dispose()
      videoCache.disposeAll()
      for (const screen of [build.laptopScreen, build.phoneScreen]) {
        const mat = screen.material as THREE.MeshBasicMaterial
        mat.map?.dispose()
        screen.geometry.dispose()
        mat.dispose()
      }
      spGeo.dispose()
      renderer.dispose()
    }
  }, [mounted])

  return (
    <section id="showcase" ref={sectionRef} className="section-shell relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center reveal">
          <div className="mt-6 inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="h-4 w-4 text-[color:var(--accent-primary)]" />
            Mobile + Web
          </div>
          <h2 className="section-title">One Engineer. Every Screen.</h2>
          <p className="section-subtitle text-lg max-w-3xl mx-auto">
            My live projects, rendered right inside the devices. Drag to orbit, scroll to zoom — none of this is a mock.
          </p>
        </div>

        <div ref={cardRef} className="relative h-[24rem] w-full overflow-hidden rounded-[2rem] glass-card sm:h-[28rem] md:h-[31rem]">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ cursor: "grab" }} />

          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-2xl glass-card px-3 py-1.5 text-[10px] font-bold opacity-90 sm:left-5 sm:top-5 sm:px-3.5 sm:py-2 sm:text-xs">
            <Smartphone className="h-4 w-4 text-[color:var(--accent-primary)]" />
            React Native · iOS · Android
          </div>
          <div className="pointer-events-none absolute right-5 top-5 hidden items-center gap-2 rounded-2xl glass-card px-3.5 py-2 text-xs font-bold opacity-90 animate-float sm:flex">
            <AppWindow className="h-4 w-4 text-[color:var(--accent-secondary)]" />
            Next.js · MERN · FastAPI
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-2xl glass-card px-3 py-1.5 text-[10px] font-bold opacity-90 sm:bottom-5 sm:left-5 sm:px-3.5 sm:py-2 sm:text-xs">
            <Globe className="h-4 w-4 text-[color:var(--accent-primary)]" />
            Responsive · PWA-ready
          </div>
          <div className="pointer-events-none absolute bottom-5 right-5 hidden items-center gap-2 rounded-2xl glass-card px-3.5 py-2 text-xs font-bold opacity-90 animate-float sm:flex" style={{ animationDelay: "1.2s" }}>
            <Zap className="h-4 w-4 text-[color:var(--accent-secondary)]" />
            60fps Interactivity
          </div>

          <p
            ref={hintRef}
            className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto flex w-fit items-center gap-2 rounded-full bg-black/45 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-opacity duration-500 sm:bottom-24"
          >
            <Move3d className="h-4 w-4" />
            Drag to orbit · Scroll to zoom
          </p>
        </div>
      </div>
    </section>
  )
}