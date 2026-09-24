"use client"

import { useState } from "react"
import {
  FolderKanban,
  Play,
  GraduationCap,
  Briefcase,
  Sparkles,
  Mail,
  User,
  ArrowRight,
  RotateCw,
  LayoutDashboard,
} from "lucide-react"
import {
  useCategorizedProjects,
  useLiveProjects,
  useEducationEntries,
  useTimelineEntries,
  useSkills,
  useSocialLinks,
} from "@/lib/useConfig"
import { Card, Button } from "@/components/admin/ui"

function Stat(
  count: number | undefined,
  label: string,
  sub: string
) {
  return { count, label, sub }
}

function SkeletonRow() {
  return (
    <div className="animate-pulse spacing-y-2 space-y-2">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="h-4 w-40 rounded bg-zinc-200" />
    </div>
  )
}

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (key: string) => void
}) {
  const [refreshing, setRefreshing] = useState(false)
  const projects = useCategorizedProjects()
  const live = useLiveProjects()
  const education = useEducationEntries()
  const timeline = useTimelineEntries()
  const skills = useSkills()
  const social = useSocialLinks()

  const refreshAll = async () => {
    setRefreshing(true)
    window.dispatchEvent(new Event("portfolioConfigUpdated"))
    await new Promise((r) => setTimeout(r, 400))
    setRefreshing(false)
  }

  const stats = [
    Stat(projects.data?.length, "Projects", "Featured portfolio work"),
    Stat(live.data?.length, "Live Projects", "Apps in production"),
    Stat(education.data?.length, "Education", "Academic entries"),
    Stat(timeline.data?.length, "Experience", "Timeline milestones"),
    Stat(skills.data?.length, "Core Skills", "Skill bars"),
    Stat(social.data?.length, "Social Links", "Contact channels"),
  ]

  const quickActions = [
    { key: "projects", label: "Add a Project", icon: FolderKanban, desc: "Showcase new work in your portfolio" },
    { key: "hero", label: "Edit Hero", icon: User, desc: "Update headline, roles and photo" },
    { key: "about", label: "Edit About", icon: Sparkles, desc: "Refresh your bio and skills" },
    { key: "contact", label: "Edit Contact", icon: Mail, desc: "Update email and social links" },
  ]

  const timelineData = timeline.data?.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <p className="text-3xl font-bold tracking-tight text-zinc-900">
              {s.count ?? "—"}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{s.label}</p>
            <p className="text-xs leading-relaxed text-zinc-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="At a Glance"
          description="Everything on this dashboard is stored directly in your database. Changes appear on the live site the moment you save."
          actions={
            <Button variant="secondary" onClick={refreshAll} icon={refreshing ? undefined : <RotateCw className="h-4 w-4" />}>
              Refresh Data
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Latest Experience
              </p>
              <div className="mt-3 space-y-3">
                {timeline.loading ? (
                  <SkeletonRow />
                ) : timelineData && timelineData.length > 0 ? (
                  timelineData.map((t) => (
                    <div key={t.id} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700">
                        {t.year}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-900">{t.title}</p>
                        <p className="line-clamp-1 text-xs text-zinc-500">{t.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No experience entries yet.</p>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Recently Added Work
              </p>
              <div className="mt-3 space-y-3">
                {projects.loading ? (
                  <SkeletonRow />
                ) : projects.data && projects.data.length > 0 ? (
                  projects.data.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.is_featured
                            ? "bg-zinc-900 text-white"
                            : "border border-zinc-300 bg-white text-zinc-600"
                        }`}
                      >
                        {p.is_featured ? "Featured" : "Project"}
                      </span>
                      <p className="min-w-0 truncate text-sm font-semibold text-zinc-900">{p.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No projects yet.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions" description="Jump straight to the section you want to edit.">
          <div className="space-y-2.5">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <button
                  key={a.key}
                  onClick={() => onNavigate(a.key)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-left transition-colors hover:border-zinc-900"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-zinc-900">{a.label}</span>
                    <span className="block truncate text-xs text-zinc-500">{a.desc}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-900" />
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <LayoutDashboard className="h-3.5 w-3.5" />
        All content is served live from your Supabase database — nothing is cached in the browser.
      </div>
    </div>
  )
}