import * as THREE from "three"

export interface VideoCacheEntry {
  video: HTMLVideoElement
  texture: THREE.VideoTexture
}

export interface VideoCache {
  get(url: string): Promise<THREE.VideoTexture | null>
  getEntry(url: string): VideoCacheEntry | undefined
  disposeAll(): void
}

export function createVideoCache(): VideoCache {
  const cache = new Map<string, VideoCacheEntry>()

  const get = (url: string): Promise<THREE.VideoTexture | null> => {
    const existing = cache.get(url)
    if (existing) return Promise.resolve(existing.texture)
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = "auto"
      video.setAttribute("playsinline", "")
      let settled = false
      const cleanup = () => {
        video.removeEventListener("loadeddata", onReady)
        video.removeEventListener("canplay", onReady)
        video.removeEventListener("error", onError)
        window.clearTimeout(timeout)
      }
      const onReady = () => {
        if (settled) return
        settled = true
        cleanup()
        const texture = new THREE.VideoTexture(video)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.userData.shared = true
        cache.set(url, { video, texture })
        video.play().catch(() => {})
        resolve(texture)
      }
      const onError = () => {
        if (settled) return
        settled = true
        cleanup()
        resolve(null)
      }
      const timeout = window.setTimeout(onError, 8000)
      video.addEventListener("loadeddata", onReady)
      video.addEventListener("canplay", onReady)
      video.addEventListener("error", onError)
      video.src = url
      video.load()
    })
  }

  const disposeAll = () => {
    for (const { video, texture } of cache.values()) {
      texture.userData.shared = true
      texture.dispose()
      video.pause()
      video.removeAttribute("src")
      video.load()
    }
    cache.clear()
  }

  return { get, getEntry: (url) => cache.get(url), disposeAll }
}