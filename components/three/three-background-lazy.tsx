"use client"

import dynamic from "next/dynamic"

const ThreeBackgroundCanvas = dynamic(
  () => import("./three-background").then((m) => m.ThreeBackground),
  { ssr: false }
)

export function ThreeBackgroundLazy() {
  return <ThreeBackgroundCanvas />
}