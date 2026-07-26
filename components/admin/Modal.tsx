"use client"

import React, { ReactNode, useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), 250)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!mounted) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-250 ${
        visible ? "bg-black/50 backdrop-blur-md" : "bg-black/0 backdrop-blur-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} overflow-hidden rounded-2xl border border-[color:var(--card-border)] shadow-2xl transition-all duration-250 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
        style={{ background: "var(--surface-strong, rgba(255,255,255,0.95))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full"
          style={{ background: "var(--gradient-main)" }}
        />
        {title && (
          <div className="flex items-center justify-between border-b border-[color:var(--card-border)] px-6 py-4">
            <h3 className="font-sora text-lg font-bold text-[color:var(--text-primary)]">
              {title}
            </h3>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-black/5 hover:scale-110"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5 text-[color:var(--text-secondary)]" />
            </button>
          </div>
        )}
        {!title && (
          <button
            className="absolute right-4 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-black/5 hover:scale-110"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[color:var(--text-secondary)]" />
          </button>
        )}
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
