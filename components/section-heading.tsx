import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  icon: LucideIcon
  chip: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeading({ icon: Icon, chip, title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 text-center reveal", className)}>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
        <Icon className="h-4 w-4 text-[color:var(--accent-primary)]" />
        {chip}
      </div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle mx-auto max-w-3xl text-lg">{subtitle}</p>}
    </div>
  )
}