// lib/content.ts
// Centralized, type-safe content configuration for the portfolio.
// Static marketing content lives here so it is trivial to update.
// Dynamic content (projects, timeline, education, skills) still comes
// from Supabase via /lib/useConfig.ts.

import type { LucideIcon } from "lucide-react"
import {
  Globe,
  Smartphone,
  Server,
  Radio,
  PenTool,
  Database,
  Webhook,
  Activity,
  Cpu,
  Gauge,
  LayoutDashboard,
} from "lucide-react"

/* ============================================================
   Stats
   ------------------------------------------------------------
   Values mirror the previous hero so nothing is invented. These
   are centralized so they can be corrected/updated in one place.
   ============================================================ */

export interface PortfolioStat {
  value: number
  suffix: string
  label: string
}

export const stats: PortfolioStat[] = [
  { value: 4, suffix: "+", label: "Years Building" },
  { value: 40, suffix: "+", label: "Projects" },
  { value: 15, suffix: "+", label: "Production Systems" },
]

/* ============================================================
   Hero
   ============================================================ */

export const heroTech = [
  "Next.js",
  "React",
  "React Native",
  "FastAPI",
  "Node.js",
  "PostgreSQL",
  "IoT",
]

export const heroHeadline = "I build web & mobile products that actually ship."

export const heroSubtext =
  "Full-stack engineer specializing in Next.js, React Native, FastAPI, Node.js and PostgreSQL — from polished interfaces to production APIs and real-time systems."

/* ============================================================
   What I Build
   ============================================================ */

export interface BuildCard {
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
}

export const whatIBuild: BuildCard[] = [
  {
    icon: Globe,
    title: "Web Applications",
    description:
      "Scalable dashboards, SaaS platforms, business applications, admin panels and modern web experiences.",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description: "Cross-platform React Native applications for iOS and Android.",
    tags: ["React Native", "Expo"],
  },
  {
    icon: Server,
    title: "Backend & APIs",
    description:
      "REST APIs, authentication, database architecture, integrations and scalable backend services.",
    tags: ["Node.js", "FastAPI", "PostgreSQL"],
  },
  {
    icon: Radio,
    title: "Real-Time & IoT",
    description:
      "MQTT, WebSockets, device communication, live dashboards and real-time data systems.",
    tags: ["MQTT", "WebSockets", "Redis"],
  },
  {
    icon: PenTool,
    title: "UI/UX → Production",
    description:
      "Turning Figma designs and product ideas into polished, production-ready applications.",
    tags: ["Figma", "UI/UX", "Responsive"],
  },
]

/* ============================================================
   Tech stack (categories replace subjective %) 
   ============================================================ */

export interface TechCategory {
  label: string
  icon: LucideIcon
  technologies: string[]
}

export const techStackCategories: TechCategory[] = [
  { label: "Frontend", icon: Globe, technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "MUI"] },
  { label: "Backend", icon: Server, technologies: ["Node.js", "Express", "Fastify", "FastAPI"] },
  { label: "Mobile", icon: Smartphone, technologies: ["React Native", "Expo"] },
  { label: "Databases", icon: Database, technologies: ["PostgreSQL", "MongoDB", "Redis"] },
  { label: "Real-Time", icon: Activity, technologies: ["MQTT", "WebSockets"] },
  { label: "DevOps & Tools", icon: Webhook, technologies: ["Docker", "Git", "GitHub", "CI/CD"] },
]

/* ============================================================
   Built for Production
   ============================================================ */

export interface ProductionCard {
  icon: LucideIcon
  label: string
  detail: string
}

export const builtForProduction: ProductionCard[] = [
  { icon: Server, label: "Production APIs", detail: "FastAPI & Node.js services serving live apps." },
  { icon: Smartphone, label: "Mobile Applications", detail: "React Native apps shipped to Android/iOS." },
  { icon: Radio, label: "Real-Time Systems", detail: "Live data pipelines and telemetry dashboards." },
  { icon: Cpu, label: "IoT Systems", detail: "Device-linked dashboards and monitoring." },
  { icon: Database, label: "Database-Heavy Apps", detail: "PostgreSQL, Redis & MongoDB engineered for scale." },
  { icon: LayoutDashboard, label: "Admin & Ops Dashboards", detail: "Internal tools that run day-to-day operations." },
]

export const productionIntro =
  "I work across the full product stack — from user interfaces and APIs to databases, real-time communication and production infrastructure."

/* ============================================================
   How I Build — architecture diagram
   ============================================================ */

export const howIBuild: { label: string; detail: string }[] = [
  { label: "User", detail: "Web · Mobile" },
  { label: "Web / Mobile", detail: "React · Next.js · React Native" },
  { label: "API Layer", detail: "REST · WebSockets" },
  { label: "Backend Services", detail: "Node.js · FastAPI" },
  { label: "Database / Cache / Queues", detail: "PostgreSQL · MongoDB · Redis" },
  { label: "Real-Time / IoT", detail: "MQTT · WebSockets · Devices" },
]

/* ============================================================
   From Idea → Production
   ============================================================ */

export interface WorkflowStep {
  step: string
  title: string
  description: string
}

export const workflowSteps: WorkflowStep[] = [
  { step: "01", title: "Understand", description: "Requirements, users and business goals." },
  { step: "02", title: "Design", description: "User flows, UX and responsive UI." },
  { step: "03", title: "Build", description: "Frontend, backend and database." },
  {
    step: "04",
    title: "Integrate",
    description: "Authentication, APIs, third-party services and real-time systems.",
  },
  { step: "05", title: "Deploy", description: "Production deployment, CI/CD and monitoring." },
  { step: "06", title: "Improve", description: "Performance, bugs, maintenance and future iterations." },
]

/* ============================================================
   Currently
   ============================================================ */

export const currentlyItems = [
  "Building production full-stack systems",
  "Studying Computer Science",
  "Exploring AI-powered applications",
  "Learning deeper backend & scalable architecture",
  "Open to freelance projects and collaborations",
]

/* ============================================================
   Services — freelance/client CTA
   ============================================================ */

export interface Service {
  icon: LucideIcon
  label: string
}

export const services: Service[] = [
  { icon: Globe, label: "Web Applications" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: LayoutDashboard, label: "SaaS / MVP Development" },
  { icon: Gauge, label: "Admin Dashboards" },
  { icon: Server, label: "Backend APIs" },
  { icon: Radio, label: "IoT / Real-Time Systems" },
  { icon: PenTool, label: "Existing App Improvements" },
]

export const servicesHeading = "Have a product idea?"
export const servicesSubtext =
  "I can help turn your idea, Figma design, or existing application into a polished web or mobile product."

/* ============================================================
   Selected work — top production projects
   ------------------------------------------------------------
   Titles reference rows in the categorized_projects table.
   Details stay grounded in the existing project descriptions and
   the professional timeline (Asani.io role). No metrics invented.
   ============================================================ */

export interface CaseSection {
  heading: string
  body: string
}

export interface CaseStudy {
  projectTitle: string
  summary: string
  role: string
  type: string
  techStack: { label: string; items: string[] }[]
  architecture: { label: string; detail: string }[]
  engineering: string[]
  problem: string
  solution: string
  outcome: string
}

export interface SelectedProject {
  title: string
  demo_url: string
  github_url: string
  image_url: string
  video_url: string
}

// Static metadata for the curated "Selected Work" cards so the section
// renders meaningful content immediately (no skeleton-first-paint), even
// while the live Supabase data loads. The database values override these
// when present and valid. Image/video paths are local files in /public.
export const selectedProjects: SelectedProject[] = [
  {
    title: "KWSC Unified App",
    demo_url: "https://play.google.com/store/apps/details?id=pk.gov.kwsc.kwsc_digital&hl=en",
    github_url: "",
    image_url: "/kwsc.png",
    video_url: "",
  },
  {
    title: "Asani Dashboard",
    demo_url: "https://asani.io",
    github_url: "",
    image_url: "/asani-dashboard.png",
    video_url: "",
  },
  {
    title: "Aligarh Institute of Technology",
    demo_url:
      "https://www.linkedin.com/posts/ayeshaafzalqadir_reactnative-edtech-erpdevelopment-activity-7281908979293708288-DF23",
    github_url: "",
    image_url: "",
    video_url: "/Aligarh.mp4",
  },
  {
    title: "Asani Website",
    demo_url: "https://asani-website.vercel.app",
    github_url: "",
    image_url: "/web.png",
    video_url: "",
  },
  {
    title: "Taverna",
    demo_url:
      "https://www.linkedin.com/posts/ayeshaafzalqadir_mobileappdevelopment-tavernaapp-innovation-activity-7284941587606884352-GpZZ",
    github_url: "",
    image_url: "",
    video_url: "/Taverna.mp4",
  },
]

export const selectedWorkTitles = selectedProjects.map((p) => p.title)

export const caseStudies: CaseStudy[] = [
  {
    projectTitle: "KWSC Unified App",
    summary:
      "A public utility mobile app that brings water-related services into one place for consumers.",
    role: "Backend engineering on the Fastify API and PostgreSQL data layer.",
    type: "Full-Stack · Real-Time / IoT",
    techStack: [
      { label: "Backend", items: ["Fastify", "Node.js"] },
      { label: "Database", items: ["PostgreSQL"] },
      { label: "Infrastructure", items: ["CI/CD (Jenkins)", "Cloud Logs", "Prometheus", "Grafana"] },
      { label: "Client", items: ["Mobile app (distribution via Play Store)"] },
    ],
    architecture: [
      { label: "Mobile App", detail: "Consumer utilities app" },
      { label: "API Layer", detail: "Fastify backends" },
      { label: "Data Layer", detail: "PostgreSQL" },
      { label: "Monitoring", detail: "Prometheus · Grafana · Cloud logs" },
    ],
    engineering: [
      "REST API development with Fastify for the unified app backend.",
      "PostgreSQL schema design and query work for utility data.",
      "Real-time data APIs for live infrastructure tracking.",
      "CI/CD pipeline with Jenkins for unified deployments.",
      "Production monitoring with Prometheus & Grafana and cloud log review.",
    ],
    problem:
      "Utility services were fragmented — consumers needed one place to access water-related services.",
    solution:
      "A unified app backed by Fastify APIs and PostgreSQL, with real-time telemetry data and production monitoring.",
    outcome:
      "A live, publicly distributed utility app currently in production. (Specific adoption metrics are not published.)",
  },
  {
    projectTitle: "Asani Dashboard",
    summary:
      "A web application delivering real-time insights and analytics dashboards for projects.",
    role: "Full-stack contribution on the real-time dashboard layer and data services.",
    type: "Full-Stack · Real-Time Analytics",
    techStack: [
      { label: "Backend", items: ["Node.js"] },
      { label: "Database / Cache", items: ["PostgreSQL", "Redis"] },
      { label: "Client", items: ["Web dashboard UI"] },
    ],
    architecture: [
      { label: "Dashboard", detail: "Web app" },
      { label: "API Layer", detail: "Node.js services" },
      { label: "Cache", detail: "Redis" },
      { label: "Database", detail: "PostgreSQL" },
    ],
    engineering: [
      "Real-time analytics and insights dashboards for project data.",
      "Node.js backend services with PostgreSQL.",
      "Redis-backed caching for faster reads.",
    ],
    problem:
      "Teams needed a real-time view of project insights and analytics without manual reporting.",
    solution:
      "A comprehensive dashboard application with live, queryable analytics over the project data.",
    outcome:
      "An internal production tool used for day-to-day project insights.",
  },
  {
    projectTitle: "Aligarh Institute of Technology",
    summary: "An ERP mobile application for Aligarh Institute of Technology, built with React Native.",
    role: "React Native developer — built and shipped the ERP app.",
    type: "Mobile · React Native",
    techStack: [
      { label: "Mobile", items: ["React Native"] },
      { label: "Backend / Services", items: ["Firebase"] },
    ],
    architecture: [
      { label: "Mobile App", detail: "React Native" },
      { label: "Backend Services", detail: "Firebase" },
    ],
    engineering: [
      "Built the ERP app with React Native.",
      "Integrated Firebase backend services.",
    ],
    problem:
      "The institute needed a mobile ERP application for students and staff workflows.",
    solution:
      "A dedicated React Native ERP app for the institute, backed by Firebase.",
    outcome:
      "A production mobile app shipped for the institution. (No private usage data published.)",
  },
]

/* ============================================================
   Project filtering topics
   ------------------------------------------------------------
   Deterministic mapping used by the "all projects" grid.
   ============================================================ */

export type ProjectTopic = "Web" | "Mobile" | "Backend" | "IoT" | "UI/UX"

const BACKEND_TECH = ["fastify", "postgresql", "redis", "express", "nestjs", "fastapi"]
const IOT_HINTS = ["mqtt", "telemetry", "websocket", "realtime", "real-time"]

export function resolveProjectTopic(project: {
  title: string
  description: string
  category: string
  tech_stack: string[]
}): ProjectTopic {
  const haystack = `${project.title} ${project.description}`.toLowerCase()
  const tech = (project.tech_stack || []).map((t) => t.toLowerCase())

  if (project.category === "Mobile Apps") return "Mobile"
  if (project.category === "UI/UX Designs") return "UI/UX"
  if (project.category === "Backend") return "Backend"
  if (tech.some((t) => BACKEND_TECH.includes(t))) return "Backend"
  if (IOT_HINTS.some((hint) => haystack.includes(hint))) return "IoT"
  return "Web"
}

export const projectTopics: ("All" | ProjectTopic)[] = ["All", "Web", "Mobile", "Backend", "IoT", "UI/UX"]