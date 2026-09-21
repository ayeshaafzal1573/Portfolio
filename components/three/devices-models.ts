import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

/* ------------------------------------------------------------------ */
/* Shared procedural 3D models: MacBook + iPhone ----------------------- */
/* Built entirely from primitives + CanvasTextures (no external files). */
/* ------------------------------------------------------------------ */

export function readThemeColor(name: string): string {
  if (typeof document === "undefined") return "#a2653c"
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || "#a2653c"
}

export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

type Std = THREE.MeshStandardMaterial

function metal(color: number | string, metalness = 0.85, roughness = 0.36): Std {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness })
}

/* ---------------- Screen textures (fake UI on the devices) ---------------- */

function drawLaptopUI(ctx: CanvasRenderingContext2D, w: number, h: number, primary: string, secondary: string) {
  // window chrome
  ctx.fillStyle = "#10141c"
  ctx.fillRect(0, 0, w, 0.085 * h)
  const dot = (x: number, color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, 0.0425 * h, 0.012 * w, 0, Math.PI * 2)
    ctx.fill()
  }
  dot(0.06 * w, secondary)
  dot(0.09 * w, "#f2a25c")
  dot(0.12 * w, primary)
  // bright glow from the gradient brand
  const glow = ctx.createRadialGradient(w / 2, 0.22 * h, 8, w / 2, 0.22 * h, 0.5 * w)
  glow.addColorStop(0, primary + "55")
  glow.addColorStop(1, "transparent")
  ctx.fillStyle = glow
  ctx.fillRect(0, 0.085 * h, w, h - 0.085 * h)

  // sidebar
  ctx.fillStyle = "#131922"
  roundRect(ctx, 0.028 * w, 0.12 * h, 0.16 * w, 0.84 * h, 0.02 * w)
  ctx.fill()
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i === 0 ? primary : "#232c38"
    roundRect(ctx, 0.052 * w, (0.16 + i * 0.11) * h, 0.1 * w, 0.035 * h, 0.017 * w)
    ctx.fill()
  }

  // code lines
  const lx = 0.24 * w
  for (let i = 0; i < 6; i++) {
    const y = (0.18 + i * 0.095) * h
    ctx.fillStyle = "#232c38"
    roundRect(ctx, lx, y, (0.38 - (i % 3) * 0.06) * w, 0.028 * h, 0.014 * w)
    ctx.fill()
    if (i % 2 === 0) {
      ctx.fillStyle = primary
      ctx.fillRect(lx - 0.014 * w, y, 0.006 * w, 0.028 * h)
    }
  }

  // bar chart (the "dashboard" feel)
  const bx = 0.68 * w
  const base = 0.72 * h
  const heights = [0.2, 0.34, 0.27, 0.46, 0.38, 0.58]
  for (let i = 0; i < heights.length; i++) {
    const bh = heights[i] * h * 0.5
    const g = ctx.createLinearGradient(0, base - bh, 0, base)
    g.addColorStop(0, primary)
    g.addColorStop(1, secondary)
    ctx.fillStyle = g
    roundRect(ctx, bx + i * (0.052 * w), base - bh, 0.036 * w, bh, 0.014 * w)
    ctx.fill()
  }
  ctx.fillStyle = "#1b2330"
  roundRect(ctx, bx, base, 0.34 * w, 0.012 * h, 0.006 * w)
  ctx.fill()
}

function drawPhoneUI(ctx: CanvasRenderingContext2D, w: number, h: number, primary: string, secondary: string) {
  // status bar
  ctx.fillStyle = "#10141c"
  roundRect(ctx, 0.06 * w, 0.03 * h, 0.2 * w, 0.02 * h, 0.01 * w)
  ctx.fill()
  ctx.fillStyle = "#1a2330"
  ctx.fillRect(0.66 * w, 0.03 * h, 0.06 * w, 0.02 * h)
  ctx.fillRect(0.76 * w, 0.03 * h, 0.06 * w, 0.02 * h)
  ctx.fillRect(0.86 * w, 0.03 * h, 0.06 * w, 0.02 * h)

  // greeting pill
  ctx.fillStyle = primary
  roundRect(ctx, 0.09 * w, 0.12 * h, 0.82 * w, 0.07 * h, 0.035 * w)
  ctx.fill()
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0.14 * w, 0.145 * h, 0.34 * w, 0.02 * h)

  // chat bubble (me, right)
  const bubble = (x: number, y: number, bw: number, bh: number, color: string, right: boolean) => {
    ctx.fillStyle = color
    if (right) roundRect(ctx, x - bw, y, bw, bh, 0.06 * w)
    else roundRect(ctx, x, y, bw, bh, 0.06 * w)
    ctx.fill()
  }
  bubble(0.91 * w, 0.24 * h, 0.5 * w, 0.11 * h, primary, true)
  bubble(0.09 * w, 0.4 * h, 0.6 * w, 0.11 * h, "#222b38", false)
  bubble(0.91 * w, 0.56 * h, 0.42 * w, 0.11 * h, secondary, true)
  bubble(0.09 * w, 0.72 * h, 0.5 * w, 0.11 * h, "#222b38", false)

  // dock
  ctx.fillStyle = "rgba(255,255,255,0.07)"
  roundRect(ctx, 0.1 * w, 0.86 * h, 0.8 * w, 0.1 * h, 0.05 * w)
  ctx.fill()
  for (let i = 0; i < 4; i++) {
    const x = 0.15 + i * 0.2
    ctx.fillStyle = i % 2 === 0 ? primary : secondary
    roundRect(ctx, x * w, 0.883 * h, 0.1 * w, 0.075 * h, 0.02 * w)
    ctx.fill()
  }
}

function makeCanvas(size: [number, number]) {
  const cv = document.createElement("canvas")
  cv.width = size[0]
  cv.height = size[1]
  return { cv, ctx: cv.getContext("2d")! }
}

export function makeScreenTexture(kind: "laptop" | "phone", primary: string, secondary: string): THREE.CanvasTexture {
  const isLaptop = kind === "laptop"
  const { cv, ctx } = makeCanvas(isLaptop ? [1024, 576] : [512, 1024])
  const w = cv.width
  const h = cv.height

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0c1420")
  bg.addColorStop(0.6, "#10161f")
  bg.addColorStop(1, "#140f0a")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  if (isLaptop) drawLaptopUI(ctx, w, h, primary, secondary)
  else drawPhoneUI(ctx, w, h, primary, secondary)

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function makeDeckTexture(): THREE.CanvasTexture {
  const { cv, ctx } = makeCanvas([1024, 256])
  const w = cv.width
  const h = cv.height
  ctx.fillStyle = "#1b1b20"
  ctx.fillRect(0, 0, w, h)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 15; col++) {
      ctx.fillStyle = "#101014"
      roundRect(ctx, 0.012 * w + col * 0.065 * w, 0.14 * h + row * 0.15 * h, 0.055 * w, 0.11 * h, 0.02 * w)
      ctx.fill()
    }
  }
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/* ---------------- Contact shadows ---------------- */

export function makeContactShadow(): THREE.Mesh {
  const { cv, ctx } = makeCanvas([512, 512])
  const g = ctx.createRadialGradient(256, 256, 12, 256, 256, 256)
  g.addColorStop(0, "rgba(0,0,0,0.5)")
  g.addColorStop(0.55, "rgba(0,0,0,0.2)")
  g.addColorStop(1, "rgba(0,0,0,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 512)
  const tex = new THREE.CanvasTexture(cv)
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat)
  mesh.rotation.x = -Math.PI / 2
  return mesh
}

/* ---------------- Models ---------------- */

export function buildMacBook(primary: string, secondary: string): { group: THREE.Group; screen: THREE.Mesh; screenHost: THREE.Group } {
  const group = new THREE.Group()

  // base
  const body = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.13, 1.55, 4, 0.045), metal("#27272c", 0.9, 0.34))
  body.position.y = 0.065
  group.add(body)

  // keyboard deck
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 1.26), new THREE.MeshBasicMaterial({ map: makeDeckTexture() }))
  deck.rotation.x = -Math.PI / 2
  deck.position.set(0, 0.132, -0.02)
  group.add(deck)

  // trackpad
  const trackpad = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.012, 0.36, 3, 0.03), metal("#1b1b1f", 0.85, 0.4))
  trackpad.position.set(0, 0.15, 0.3)
  group.add(trackpad)

  // screen assembly (build upright, front faces +Z)
  const screenGroup = new THREE.Group()
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(2.14, 1.4, 0.05, 4, 0.045), metal("#0e0e12", 0.65, 0.5))
  bezel.position.set(0, 0.75, 0)
  screenGroup.add(bezel)

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.98, 1.24),
    new THREE.MeshBasicMaterial({ map: makeScreenTexture("laptop", primary, secondary) })
  )
  screen.position.set(0, 0.78, 0.028)
  screenGroup.add(screen)

  const notch = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.035, 0.012, 4, 0.012), metal("#050507", 0.7, 0.45))
  notch.position.set(0, 1.39, 0.028)
  screenGroup.add(notch)

  screenGroup.position.set(0, 0.13, -0.775)
  screenGroup.rotation.x = -Math.PI / 2 + 0.6
  group.add(screenGroup)

  return { group, screen, screenHost: screenGroup }
}

export function buildPhone(primary: string, secondary: string): { group: THREE.Group; screen: THREE.Mesh; screenHost: THREE.Group } {
  const group = new THREE.Group()

  const body = new THREE.Mesh(new RoundedBoxGeometry(0.62, 1.3, 0.085, 6, 0.09), metal("#212126", 0.9, 0.32))
  group.add(body)

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 1.26),
    new THREE.MeshBasicMaterial({ map: makeScreenTexture("phone", primary, secondary) })
  )
  screen.position.z = 0.044
  group.add(screen)

  // dynamic island
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.155, 0.038, 0.012, 4, 0.02), metal("#0a0a0c", 0.7, 0.4))
  island.position.set(0, 0.56, 0.0445)
  group.add(island)

  // rear camera lenses
  const makeLens = (y: number, r: number) => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.022, 16), metal("#0b0b0d", 0.9, 0.18))
    lens.rotation.x = Math.PI / 2
    lens.position.set(0, y, -0.047)
    return lens
  }
  group.add(makeLens(0.32, 0.05), makeLens(0.2, 0.032))

  // side buttons
  const btn = new THREE.Mesh(new RoundedBoxGeometry(0.012, 0.16, 0.045, 2, 0.008), metal("#2c2c31", 0.9, 0.35))
  btn.position.set(0.318, 0.3, 0)
  const btnL = btn.clone()
  btnL.position.x = -0.318
  group.add(btn, btnL)

  return { group, screen, screenHost: group }
}

export interface DevicesBuild {
  group: THREE.Group
  laptop: THREE.Group
  phone: THREE.Group
  laptopScreen: THREE.Mesh
  phoneScreen: THREE.Mesh
  laptopScreenHost: THREE.Object3D
  phoneScreenHost: THREE.Object3D
  shadows: THREE.Mesh[]
  disposables: { dispose(): void }[]
}

export function buildDevices(primary: string, secondary: string): DevicesBuild {
  const laptop = buildMacBook(primary, secondary)
  const phone = buildPhone(primary, secondary)

  const laptopShadow = makeContactShadow()
  laptopShadow.position.set(-0.55, 0.001, 0)
  laptopShadow.scale.set(2.9, 2.0, 1)

  const phoneShadow = makeContactShadow()
  phoneShadow.position.set(1.05, 0.001, 0.4)
  phoneShadow.scale.set(1.1, 1.1, 1)

  laptop.group.rotation.y = -0.18
  laptop.group.position.set(-0.55, 0, 0.0)

  phone.group.rotation.y = -0.5
  phone.group.position.set(1.05, 0.34, 0.4)

  const group = new THREE.Group()
  group.add(laptop.group, phone.group, laptopShadow, phoneShadow)

  return {
    group,
    laptop: laptop.group,
    phone: phone.group,
    laptopScreen: laptop.screen,
    phoneScreen: phone.screen,
    laptopScreenHost: laptop.screenHost,
    phoneScreenHost: phone.screenHost,
    shadows: [laptopShadow, phoneShadow],
    disposables: [
      laptopShadow.geometry,
      laptopShadow.material as THREE.Material,
      phoneShadow.geometry,
      phoneShadow.material as THREE.Material,
    ],
  }
}

export function refreshScreens(build: DevicesBuild, primary: string, secondary: string) {
  const oldLaptop = build.laptopScreen.material as THREE.MeshBasicMaterial
  const oldPhone = build.phoneScreen.material as THREE.MeshBasicMaterial
  const laptopTex = makeScreenTexture("laptop", primary, secondary)
  const phoneTex = makeScreenTexture("phone", primary, secondary)
  oldLaptop.map?.dispose()
  oldPhone.map?.dispose()
  oldLaptop.map = laptopTex
  oldPhone.map = phoneTex
}

/* ---------------- Project slides (rendered inside the screens) ---------------- */

export interface SlideProject {
  title: string
  description?: string
  category?: string
  tech_stack?: string[]
  image_url?: string
  video_url?: string
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3): string[] {
  const words = String(text || "").split(/\s+/)
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    if (lines.length >= maxLines) break
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (lines.length < maxLines && line) lines.push(line)
  return lines
}

function loadSlideImage(url?: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url || ""
  })
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function coverDraw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const iw = img.width || 1
  const ih = img.height || 1
  const scale = Math.max(w / iw, h / ih)
  const dw = iw * scale
  const dh = ih * scale
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

function drawBaseCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  primary: string,
  secondary: string
) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, "#131120")
  g.addColorStop(0.55, "#17120e")
  g.addColorStop(1, "#22130a")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const glowA = ctx.createRadialGradient(0, 0, 8, 0, 0, Math.max(w, h) * 0.7)
  glowA.addColorStop(0, primary + "44")
  glowA.addColorStop(1, "transparent")
  ctx.fillStyle = glowA
  ctx.fillRect(0, 0, w, h)

  const glowB = ctx.createRadialGradient(w, h, 8, w, h, Math.max(w, h) * 0.6)
  glowB.addColorStop(0, secondary + "33")
  glowB.addColorStop(1, "transparent")
  ctx.fillStyle = glowB
  ctx.fillRect(0, 0, w, h)
}

function drawChips(
  ctx: CanvasRenderingContext2D,
  tags: string[],
  x: number,
  y: number,
  maxWidth: number,
  size = 16,
  cap = 4
) {
  let cx = x
  const cy = y
  const hh = size + 12
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"
  const list = tags.slice(0, cap)
  for (const tag of list) {
    ctx.font = `600 ${size}px ui-sans-serif, system-ui, sans-serif`
    const tw = ctx.measureText(tag).width
    const cw = tw + 22
    if (cx + cw > maxWidth) break
    ctx.fillStyle = "rgba(255,255,255,0.12)"
    roundedRect(ctx, cx, cy, cw, hh, hh / 2)
    ctx.fill()
    ctx.fillStyle = "rgba(255,255,255,0.92)"
    ctx.fillText(tag, cx + 11, cy + hh / 2 + 1)
    cx += cw + 10
  }
}

async function drawProjectSlideCanvas(
  kind: "laptop" | "phone",
  project: SlideProject,
  primary: string,
  secondary: string
): Promise<HTMLCanvasElement> {
  const isLaptop = kind === "laptop"
  const w = isLaptop ? 1024 : 512
  const h = isLaptop ? 576 : 1024
  const cv = document.createElement("canvas")
  cv.width = w
  cv.height = h
  const ctx = cv.getContext("2d")!
  drawBaseCard(ctx, w, h, primary, secondary)

  const title = project.title || "Portfolio Project"
  const category = project.category || "Full-Stack"

  if (isLaptop) {
    ctx.fillStyle = secondary
    ctx.font = "700 17px ui-sans-serif, system-ui, sans-serif"
    const pillW = ctx.measureText(category).width + 28
    roundedRect(ctx, 40, 40, pillW, 32, 16)
    ctx.fill()
    ctx.fillStyle = "#101018"
    ctx.fillText(category, 54, 57)

    ctx.fillStyle = "#ffffff"
    ctx.font = "800 52px ui-sans-serif, system-ui, sans-serif"
    const lines = wrapText(ctx, title, w * 0.5 - 80, 2)
    lines.forEach((ln, i) => ctx.fillText(ln, 40, 122 + i * 58))

    const imgX = w * 0.5 + 40
    const imgY = 108
    const imgW = w - imgX - 40
    const imgH = h - 108 - 40
    ctx.fillStyle = "rgba(255,255,255,0.10)"
    roundedRect(ctx, imgX, imgY, imgW, imgH, 22)
    ctx.fill()
    const img = await loadSlideImage(project.image_url)
    if (img) {
      roundedRect(ctx, imgX, imgY, imgW, imgH, 22)
      ctx.save()
      ctx.clip()
      coverDraw(ctx, img, imgX, imgY, imgW, imgH)
      ctx.restore()
      ctx.fillStyle = "rgba(8,8,14,0.45)"
      roundedRect(ctx, imgX, imgY, imgW, imgH, 22)
      ctx.fill()
    }

    if (project.description) {
      ctx.font = "500 17px ui-sans-serif, system-ui, sans-serif"
      const descLines = wrapText(ctx, project.description, w - 80, 1)
      ctx.fillStyle = "rgba(255,255,255,0.55)"
      descLines.forEach((ln, i) => ctx.fillText(ln, 40, h - 92 + i * 24))
    }
    drawChips(ctx, project.tech_stack || [], 40, h - 64, w * 0.52)

    const btnW = 130
    const btnH = 46
    const g = ctx.createLinearGradient(w - 40 - btnW, 0, w - 40, 0)
    g.addColorStop(0, primary)
    g.addColorStop(1, secondary)
    ctx.fillStyle = g
    roundedRect(ctx, w - 40 - btnW, h - 72, btnW, btnH, 23)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = "700 16px ui-sans-serif, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("OPEN ↗", w - 40 - btnW / 2, h - 49)
  } else {
    ctx.textAlign = "center"
    ctx.fillStyle = secondary
    ctx.font = "700 17px ui-sans-serif, system-ui, sans-serif"
    const pillW = ctx.measureText(category).width + 28
    roundedRect(ctx, (w - pillW) / 2, 46, pillW, 32, 16)
    ctx.fill()
    ctx.fillStyle = "#101018"
    ctx.fillText(category, w / 2, 63)

    ctx.fillStyle = "#ffffff"
    ctx.font = "800 40px ui-sans-serif, system-ui, sans-serif"
    const lines = wrapText(ctx, title, w - 64, 3)
    lines.forEach((ln, i) => ctx.fillText(ln, w / 2, 128 + i * 46))

    const imgX = 34
    const imgY = lines.length > 1 ? 210 + 40 : 200
    const imgW = w - 68
    const imgH = 210
    ctx.fillStyle = "rgba(255,255,255,0.10)"
    roundedRect(ctx, imgX, imgY, imgW, imgH, 20)
    ctx.fill()
    const img = await loadSlideImage(project.image_url)
    if (img) {
      ctx.save()
      roundedRect(ctx, imgX, imgY, imgW, imgH, 20)
      ctx.clip()
      coverDraw(ctx, img, imgX, imgY, imgW, imgH)
      ctx.restore()
      ctx.fillStyle = "rgba(8,8,14,0.4)"
      roundedRect(ctx, imgX, imgY, imgW, imgH, 20)
      ctx.fill()
    }

    drawChips(ctx, project.tech_stack || [], 34, imgY + imgH + 26, w - 68, 16, 3)

    const btnW = w - 68
    const btnH = 56
    const g = ctx.createLinearGradient(0, 0, 0, btnH)
    g.addColorStop(0, primary)
    g.addColorStop(1, secondary)
    ctx.fillStyle = g
    roundedRect(ctx, 34, h - 92, btnW, btnH, 28)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = "700 18px ui-sans-serif, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("OPEN ↗", w / 2, h - 64)
  }

  return cv
}

async function drawBrandSlideCanvas(kind: "laptop" | "phone", primary: string, secondary: string): Promise<HTMLCanvasElement> {
  const isLaptop = kind === "laptop"
  const w = isLaptop ? 1024 : 512
  const h = isLaptop ? 576 : 1024
  const cv = document.createElement("canvas")
  cv.width = w
  cv.height = h
  const ctx = cv.getContext("2d")!
  drawBaseCard(ctx, w, h, primary, secondary)

  ctx.textAlign = "center"
  ctx.fillStyle = "#ffffff"
  if (isLaptop) {
    ctx.font = "800 64px ui-sans-serif, system-ui, sans-serif"
    ctx.fillText("Ayesha Afzal", w / 2, h * 0.42)
    ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.fillText("Web  ·  Mobile  ·  AI", w / 2, h * 0.42 + 46)
  } else {
    ctx.font = "700 40px ui-sans-serif, system-ui, sans-serif"
    ctx.fillText("Ayesha", w / 2, h * 0.34)
    ctx.fillText("Afzal", w / 2, h * 0.34 + 52)
    ctx.font = "500 20px ui-sans-serif, system-ui, sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.fillText("Full-Stack · Mobile", w / 2, h * 0.34 + 100)
    const g = ctx.createLinearGradient(70, 0, 0, 0)
    g.addColorStop(0, primary)
    g.addColorStop(1, secondary)
    ctx.fillStyle = g
    roundedRect(ctx, 70, h * 0.34 + 130, w - 140, 68, 34)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = "700 18px ui-sans-serif, system-ui, sans-serif"
    ctx.fillText("Let's Build ✦", w / 2, h * 0.34 + 169)
  }
  return cv
}

export function makeSlideTexture(
  kind: "laptop" | "phone",
  project: SlideProject | null,
  primary: string,
  secondary: string
): Promise<THREE.CanvasTexture> {
  const draw = project ? drawProjectSlideCanvas(kind, project, primary, secondary) : drawBrandSlideCanvas(kind, primary, secondary)
  return draw.then((cv) => {
    const tex = new THREE.CanvasTexture(cv)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  })
}