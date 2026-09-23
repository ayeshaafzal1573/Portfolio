"use client"

import type { ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}

export function TiltCard({
  children,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: TiltCardProps) {
  return (
    <div
      className={`tilt-card ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  )
}