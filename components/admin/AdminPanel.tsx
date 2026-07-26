"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { ToastContainer } from "@/components/admin/Toast"
import ThemeEditor from "@/components/admin/ThemeEditor"
import HeroEditor from "@/components/admin/HeroEditor"
import AboutEditor from "@/components/admin/AboutEditor"
import EducationEditor from "@/components/admin/EducationEditor"
import ProjectsEditor from "@/components/admin/ProjectsEditor"
import LiveProjectsEditor from "@/components/admin/LiveProjectsEditor"
import ContactEditor from "@/components/admin/ContactEditor"
import SiteEditor from "@/components/admin/SiteEditor"
import {
  Palette,
  ImageIcon,
  FolderKanban,
  User,
  Mail,
  Settings,
  ArrowLeft,
  LayoutDashboard,
  Menu,
  X,
  GraduationCap,
  Play,
} from "lucide-react"

const sections = {
  theme: { label: "Theme", icon: Palette, description: "Colors & presets" },
  hero: { label: "Hero", icon: ImageIcon, description: "Landing headline" },
  about: { label: "About", icon: User, description: "Bio & skills" },
  education: { label: "Education", icon: GraduationCap, description: "Academic background" },
  liveProjects: { label: "Live Projects", icon: Play, description: "Production apps" },
  projects: { label: "Projects", icon: FolderKanban, description: "Portfolio work" },
  contact: { label: "Contact", icon: Mail, description: "Email & socials" },
  site: { label: "Site Settings", icon: Settings, description: "Navbar & footer" },
} as const

type SectionKey = keyof typeof sections

export default function AdminPanel() {
  const [active, setActive] = useState<SectionKey>("theme")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderEditor = () => {
    switch (active) {
      case "theme":
        return <ThemeEditor />
      case "hero":
        return <HeroEditor />
      case "about":
        return <AboutEditor />
      case "education":
        return <EducationEditor />
      case "liveProjects":
        return <LiveProjectsEditor />
      case "projects":
        return <ProjectsEditor />
      case "contact":
        return <ContactEditor />
      case "site":
        return <SiteEditor />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-[color:var(--bg-primary)]">
      <ToastContainer />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-auto border-r border-[color:var(--card-border)] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--surface-strong, rgba(255,255,255,0.95))" }}
      >
        <div className="relative overflow-hidden px-6 pb-6 pt-8">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ background: "var(--gradient-main)" }}
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
                  style={{ background: "var(--gradient-main)" }}
                >
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--accent-primary)]">
                    Portfolio
                  </p>
                  <h2 className="font-sora text-lg font-bold text-[color:var(--text-primary)]">
                    Admin Panel
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 transition-colors hover:bg-black/5 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 pb-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-secondary)]">
            Sections
          </p>
          <div className="space-y-1">
            {(Object.entries(sections) as [SectionKey, (typeof sections)[SectionKey]][]).map(
              ([key, { label, icon: Icon, description }]) => {
                const isActive = active === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActive(key)
                      setSidebarOpen(false)
                    }}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? "shadow-md"
                        : "hover:bg-[color:var(--accent-soft)] hover:shadow-sm"
                    }`}
                    style={
                      isActive
                        ? { background: "var(--gradient-main)", color: "#fff" }
                        : undefined
                    }
                  >
                    {isActive && (
                      <div className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/80" />
                    )}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive ? "bg-white/20" : "bg-[color:var(--accent-soft)]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-white" : "text-[color:var(--accent-primary)]"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold ${
                          isActive ? "text-white" : "text-[color:var(--text-primary)]"
                        }`}
                      >
                        {label}
                      </p>
                      <p
                        className={`text-[10px] truncate ${
                          isActive ? "text-white/70" : "text-[color:var(--text-secondary)]"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                  </button>
                )
              }
            )}
          </div>
        </nav>
        <div className="border-t border-[color:var(--card-border)] p-4">
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[color:var(--text-secondary)] transition-all duration-200 hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </a>
        </div>
      </aside>
      <main className="min-h-screen flex-1 lg:ml-72">
        <div
          className="sticky top-0 z-20 flex items-center gap-3 border-b border-[color:var(--card-border)] px-4 py-3 backdrop-blur-xl lg:hidden"
          style={{ background: "var(--surface-strong, rgba(255,255,255,0.92))" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 btn-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = sections[active].icon
              return <Icon className="h-4 w-4 text-[color:var(--accent-primary)]" />
            })()}
            <span className="font-sora text-sm font-bold text-[color:var(--text-primary)]">
              {sections[active].label}
            </span>
          </div>
        </div>
        <div className="p-5 md:p-8 lg:p-10">
          <div className="mb-6 hidden lg:block">
            <div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin</span>
              <span className="text-[color:var(--card-border)]">/</span>
              <span className="font-semibold text-[color:var(--text-primary)]">
                {sections[active].label}
              </span>
            </div>
          </div>
          <div
            className="mx-auto max-w-4xl rounded-2xl border border-[color:var(--card-border)] p-6 shadow-lg md:p-8"
            style={{ background: "var(--surface-strong, rgba(255,255,255,0.92))" }}
          >
            {renderEditor()}
          </div>
        </div>
      </main>
    </div>
  )
}
