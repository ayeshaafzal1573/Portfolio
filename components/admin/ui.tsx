"use client"

import type { ReactNode, ComponentProps } from "react"
import { AlertTriangle, Check, ExternalLink, X } from "lucide-react"

/*
 * Shared monochrome UI primitives for the WordPress-style admin panel.
 * Pure black / white / grey — no pastel colours anywhere.
 */

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle"

const VARIANTS: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white shadow-sm hover:bg-zinc-700 focus-visible:outline-zinc-900",
  secondary:
    "border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline-zinc-900",
  ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-zinc-900",
  danger:
    "border border-zinc-400 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white focus-visible:outline-zinc-900",
  subtle: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:outline-zinc-900",
}

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  ...rest
}: {
  variant?: Variant
  icon?: ReactNode
  className?: string
  children: ReactNode
} & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}

export function IconButton({
  label,
  children,
  tone = "default",
  className = "",
  ...rest
}: {
  label: string
  children: ReactNode
  tone?: "default" | "danger"
  className?: string
} & ComponentProps<"button">) {
  const toneClass =
    tone === "danger"
      ? "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
  return (
    <button
      {...rest}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${toneClass} ${className}`}
    >
      {children}
    </button>
  )
}

type BadgeTone = "gray" | "dark" | "outline" | "subtle"

const BADGES: Record<BadgeTone, string> = {
  gray: "bg-zinc-100 text-zinc-700",
  dark: "bg-zinc-900 text-white",
  outline: "border border-zinc-300 text-zinc-700",
  subtle: "bg-zinc-50 text-zinc-500",
}

export function Badge({
  tone = "gray",
  className = "",
  children,
}: {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            onChange(!checked)
          }
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-zinc-900" : "bg-zinc-300"
        }`}
      >
        <span
          className={`inline-block transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-[3px]"
          }`}
          style={{ height: 18, width: 18 }}
        />
      </span>
      {label && <span className="text-sm text-zinc-900">{label}</span>}
    </label>
  )
}

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-900">
        {label}
        {required && <span className="ml-0.5 text-zinc-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-zinc-500">{hint}</span>}
    </label>
  )
}

const CONTROL_CLASS =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-60"

export function TextField({ className = "", ...props }: ComponentProps<"input">) {
  return <input {...props} className={`${CONTROL_CLASS} ${className}`} />
}

export function TextArea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${CONTROL_CLASS} resize-y ${className}`} />
}

export function SelectField({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={`${CONTROL_CLASS} ${className}`}>
      {children}
    </select>
  )
}

export function Card({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-lg border border-zinc-200 bg-white shadow-sm ${className}`}>
      {(title || description || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div>
            {title && <h2 className="text-base font-semibold text-zinc-900">{title}</h2>}
            {description && (
              <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-zinc-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function ViewSiteLink({ href = "/", label = "View Site" }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 hover:border-zinc-500 hover:bg-zinc-50"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </a>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-14 text-center">
      {icon && <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">{icon}</div>}
      <h3 className="mt-4 text-base font-semibold text-zinc-900">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Yes, delete it",
  cancelLabel = "Keep it",
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">{message}</p>
          </div>
          <IconButton label="Close" onClick={onCancel} className="ml-auto">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SuccessCheck({ className = "" }: { className?: string }) {
  return <Check className={`h-4 w-4 ${className}`} />
}