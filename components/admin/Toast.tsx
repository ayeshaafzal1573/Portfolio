"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
const listeners: Set<(t: ToastItem) => void> = new Set()

export function showToast(message: string, type: ToastType = "success") {
  const item: ToastItem = { id: ++toastId, message, type }
  listeners.forEach((fn) => fn(item))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [...prev, t])
    }
    listeners.add(handler)
    return () => {
      listeners.delete(handler)
    }
  }, [])

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          item={toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  )
}

function ToastNotification({
  item,
  onDismiss,
}: {
  item: ToastItem
  onDismiss: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-400 shrink-0" />,
  }

  const accents = {
    success: "border-l-emerald-500 bg-emerald-500/8",
    error: "border-l-red-500 bg-red-500/8",
    info: "border-l-sky-500 bg-sky-500/8",
  }

  return (
    <div
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-[color:var(--card-border)] border-l-4 ${accents[item.type]} p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : "translate-x-8 opacity-0"
      }`}
      style={{ background: "var(--surface-strong, rgba(255,255,255,0.92))" }}
    >
      {icons[item.type]}
      <p className="flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
        {item.message}
      </p>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded-md p-0.5 transition-colors hover:bg-black/5"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-[color:var(--text-secondary)]" />
      </button>
    </div>
  )
}
