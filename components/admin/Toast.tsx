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
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-3 px-4">
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
    success: <CheckCircle2 className="h-5 w-5 shrink-0 text-zinc-900" />,
    error: <AlertCircle className="h-5 w-5 shrink-0 text-zinc-900" />,
    info: <Info className="h-5 w-5 shrink-0 text-zinc-900" />,
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-200 bg-white shadow-lg p-4 transition-all duration-300 ${
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : "translate-x-8 opacity-0"
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
        {icons[item.type]}
      </span>
      <p className="flex-1 text-sm font-medium text-zinc-900">{item.message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded-md p-0.5 transition-colors hover:bg-zinc-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-zinc-500" />
      </button>
    </div>
  )
}