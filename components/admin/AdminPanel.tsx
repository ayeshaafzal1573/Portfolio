"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Play,
  Mail,
  Settings,
  ImageIcon,
  ArrowLeft,
  Menu,
  X,
  Eye,
  Palette,
  Bot,
  Inbox,
} from "lucide-react"
import { ToastContainer } from "@/components/admin/Toast"
import HeroEditor from "@/components/admin/HeroEditor"
import AboutEditor from "@/components/admin/AboutEditor"
import EducationEditor from "@/components/admin/EducationEditor"
import ProjectsEditor from "@/components/admin/ProjectsEditor"
import LiveProjectsEditor from "@/components/admin/LiveProjectsEditor"
import ContactEditor from "@/components/admin/ContactEditor"
import SiteEditor from "@/components/admin/SiteEditor"
import ExperienceEditor from "@/components/admin/ExperienceEditor"
import ThemeEditor from "@/components/admin/ThemeEditor"
import ChatbotEditor from "@/components/admin/ChatbotEditor"
import MessagesEditor from "@/components/admin/MessagesEditor"
import Dashboard from "@/components/admin/Dashboard"
import { PageHeader } from "@/components/admin/ui"

interface SectionDef {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  group: string
}

const GROUPS = [
  {
    title: "",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview of your portfolio website.", group: "General" },
    ],
  },
  {
    title: "Content",
    items: [
      { key: "hero", label: "Hero", icon: ImageIcon, description: "Headline, roles and profile photo.", group: "Content" },
      { key: "about", label: "About & Skills", icon: User, description: "Bio and core skills.", group: "Content" },
      { key: "experience", label: "Experience", icon: Briefcase, description: "Professional timeline.", group: "Content" },
      { key: "education", label: "Education", icon: GraduationCap, description: "Academic background.", group: "Content" },
      { key: "projects", label: "Projects", icon: FolderKanban, description: "Portfolio & featured work.", group: "Content" },
      { key: "liveProjects", label: "Live Projects", icon: Play, description: "Production apps.", group: "Content" },
    ],
  },
  {
    title: "Contact",
    items: [
      { key: "contact", label: "Contact & Social", icon: Mail, description: "Email, resume and social links.", group: "Contact" },
      { key: "messages", label: "Messages", icon: Inbox, description: "Contact form submissions from visitors.", group: "Contact" },
    ],
  },
  {
    title: "Appearance",
    items: [
      { key: "theme", label: "Theme & Modes", icon: Palette, description: "Dark, light and warm color themes.", group: "Appearance" },
      { key: "chatbot", label: "AI Chatbot", icon: Bot, description: "Gemini assistant name, model and welcome text.", group: "Appearance" },
      { key: "site", label: "Site Settings", icon: Settings, description: "Navbar and footer.", group: "Appearance" },
    ],
  },
]

const ALL_SECTIONS: SectionDef[] = GROUPS.flatMap((g) => g.items)

const DEFAULT_SECTION = "dashboard"

export default function AdminPanel() {
  const [active, setActive] = useState<string>(DEFAULT_SECTION)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const current = ALL_SECTIONS.find((s) => s.key === active) || ALL_SECTIONS[0]

  const renderEditor = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard onNavigate={setActive} />
      case "hero":
        return <HeroEditor />
      case "about":
        return <AboutEditor />
      case "experience":
        return <ExperienceEditor />
      case "education":
        return <EducationEditor />
      case "projects":
        return <ProjectsEditor />
      case "liveProjects":
        return <LiveProjectsEditor />
      case "contact":
        return <ContactEditor />
      case "messages":
        return <MessagesEditor />
      case "theme":
        return <ThemeEditor />
      case "chatbot":
        return <ChatbotEditor />
      case "site":
        return <SiteEditor />
      default:
        return <Dashboard onNavigate={setActive} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f1]">
      <ToastContainer />

      {/* Dark admin bar (WordPress-style) */}
      <div className="z-30 border-b border-black/40 bg-zinc-900 text-white">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Toggle admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-zinc-900">
                A
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-wide text-white">Portfolio Admin</p>
                <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">Site Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 text-xs">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 font-medium text-white/70 hover:text-white sm:inline-flex"
            >
              <Eye className="h-3.5 w-3.5" />
              View Site
            </a>
            <div className="hidden h-6 w-px bg-white/15 md:block" />
            <span className="hidden items-center gap-2 text-white/80 md:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold text-white">
                A
              </span>
              Howdy, Ayesha
            </span>
            <a
              href="/"
              className="rounded-md border border-white/20 px-3 py-1.5 font-medium text-white hover:border-white hover:bg-white hover:text-zinc-900"
            >
              Back to Site
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Grouped sidebar */}
        <aside
          className={`fixed bottom-0 left-0 top-14 z-30 w-64 shrink-0 overflow-y-auto border-r border-zinc-200 bg-white px-3 py-5 transition-transform duration-300 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="mb-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 lg:hidden"
          >
            <X className="h-4 w-4" />
            Close menu
          </button>

          <nav className="space-y-6">
            {GROUPS.map((group) => (
              <div key={group.title || "menu"}>
                {group.title && (
                  <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                    {group.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = active === item.key
                    const Icon = item.icon
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setActive(item.key)
                          setSidebarOpen(false)
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-8 border-t border-zinc-200 pt-4">
            <a
              href="/"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </a>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <PageHeader title={current.label} description={current.description} />
          {renderEditor()}
        </main>
      </div>
    </div>
  )
}