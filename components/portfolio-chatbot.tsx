"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Sparkles, User, MessageSquare, RotateCcw } from "lucide-react"

interface Message {
  sender: "user" | "bot"
  text: string
  timestamp: Date
}

const PRESET_QUESTIONS = [
  { label: "💻 Tech Stack & Skills", query: "What is Ayesha's complete tech stack?" },
  { label: "💼 Work Experience", query: "Tell me about Ayesha's work experience" },
  { label: "🚀 Notable Projects", query: "What are Ayesha's notable projects?" },
  { label: "💲 Services & Pricing", query: "How much does Ayesha charge for projects?" },
  { label: "📧 Contact & Hire", query: "How can I hire or contact Ayesha?" },
  { label: "🌟 Why Hire Ayesha?", query: "Why should we hire Ayesha?" }
]

// ─── Knowledge Base ────────────────────────────────────────────────────────────
const KB = {
  name: "Ayesha Afzal",
  title: "Full Stack Engineer · React Native Developer · IoT & Real-Time Systems",
  location: "Karachi, Pakistan",
  email: "ayeshaafzal1573@gmail.com",
  website: "ayeshaafzalqadir.vercel.app",
  github: "github.com/ayeshaafzal1573",
  linkedin: "linkedin.com/in/ayeshaafzalqadir",
  stats: { apps: "8+", years: "3+", companies: "6+" },

  summary:
    "Results-driven Full Stack Engineer with 3+ years of experience building scalable web applications, cross-platform mobile apps, and real-time IoT systems. Proficient across the entire development lifecycle — from crafting pixel-perfect React Native UIs to architecting high-performance Node.js/Fastify backends. Experienced in PostgreSQL optimization, RESTful API design, and cloud monitoring.",

  skills: {
    mobile: ["React Native", "Flutter", "Expo"],
    frontend: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5"],
    backend: ["Node.js", "Fastify", "Express.js", "NestJS", "FastAPI"],
    databases: ["PostgreSQL", "MongoDB", "MySQL"],
    auth: ["JWT", "RESTful APIs", "Firebase"],
    iot: ["WebSockets", "Real-Time APIs", "IoT Dashboards"],
    devops: ["Prometheus", "Grafana", "Git", "GitHub", "Postman", "Jenkins"],
    design: ["Figma", "UI/UX", "Wireframing", "Responsive Design"],
  },

  experience: [
    {
      role: "Full Stack Developer",
      company: "Asani.io",
      period: "Jul 2025 – Present",
      points: [
        "Built high-performance Fastify backend for KWSC Unified App serving real-time water utility data",
        "Designed real-time IoT APIs and monitoring dashboards for live infrastructure tracking",
        "Optimized PostgreSQL queries, reducing API response times significantly",
        "Integrated Prometheus & Grafana for production-grade system monitoring and alerting",
        "Collaborated with stakeholders on product strategy, client demos, and technical requirements",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "UpperCubes",
      period: "Jan 2024 – Jun 2025",
      points: [
        "Developed Inventory, Dispatch & Hotel Management systems across mobile (React Native) and web",
        "Built secure REST APIs with role-based authentication and fine-grained access control",
        "Designed optimized MongoDB schemas and improved backend efficiency through query restructuring",
      ],
    },
    {
      role: "React Native Developer",
      company: "AG Consultraining",
      period: "Oct 2024 – Feb 2025",
      points: [
        "Built and deployed 8 production mobile applications across Travel, eCommerce, and Education",
        "Delivered dedicated apps for Aligarh Institute and Nazeer Hussain University",
      ],
    },
    {
      role: "React Native Developer & UI/UX Designer",
      company: "Trippy",
      period: "Sep 2023 – Aug 2024",
      points: [
        "Developed 3 cross-platform travel applications and their admin dashboards",
        "Designed comprehensive UI systems and implemented scalable frontend architecture",
      ],
    },
  ],

  projects: [
    { name: "KWSC Unified App", desc: "Real-time water utility monitoring system with IoT integration (Asani.io)" },
    { name: "LuxuryStay", desc: "High-end hotel booking MERN application with full booking flow" },
    { name: "Plant Palace", desc: "Modern nursery eCommerce store with cart and checkout" },
    { name: "Taverna App", desc: "Multi-role mobile application using Expo Router & Supabase" },
    { name: "Gold/Jewelry Portal", desc: "eCommerce engine with live inventory and orders tracking" },
    { name: "AG Consultraining Apps", desc: "8 production mobile apps across Travel, eCommerce, Education domains" },
    { name: "Trippy Travel Apps", desc: "3 cross-platform travel apps with admin dashboards" },
  ],

  education: [
    { degree: "Bachelor of Science (CS)", inst: "Virtual University of Pakistan", period: "June 2026 – 2030" },
    { degree: "Diploma in Software Engineering", inst: "Aptech Pakistan", period: "Aug 2022 – Feb 2026" },
  ],
}

const PRICING = {
  freelance: {
    hourly: "PKR 3,000 – 8,000 / hour ($12 – $30 / hour)",
    monthly: "PKR 120,000 – 450,000 / month ($450 – $1,600 / month)",
  },
  services: [
    { title: "Portfolio / Landing Page", price: "PKR 25,000 – 80,000 ($90 – $300)" },
    { title: "Business Website", price: "PKR 60,000 – 180,000 ($220 – $650)" },
    { title: "Admin Dashboard / CRM", price: "PKR 80,000 – 300,000+ ($300 – $1,100+)" },
    { title: "Full MERN Web App", price: "PKR 150,000 – 700,000+ ($550 – $2,500+)" },
    { title: "React Native Mobile App", price: "PKR 180,000 – 900,000+ ($650 – $3,200+)" },
    { title: "Backend APIs (FastAPI / Node.js)", price: "PKR 70,000 – 350,000+ ($250 – $1,250+)" },
    { title: "Real-Time IoT Dashboard", price: "PKR 250,000 – 1,200,000+ ($900 – $4,300+)" },
    { title: "UI/UX Design (Figma)", price: "PKR 20,000 – 150,000+ ($70 – $550+)" },
    { title: "Bug Fixing / Optimization", price: "PKR 10,000 – 80,000 ($35 – $300)" },
    { title: "Consultation / Architecture Review", price: "PKR 5,000 – 25,000 / session ($20 – $90 / session)" },
  ],
}

// ─── Synonym Expansion Mapping ──────────────────────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  backend: ["backend", "server", "api", "apis", "node", "express", "fastify", "nestjs", "fastapi", "database", "sql", "postgres", "mongodb", "mysql", "auth", "jwt"],
  frontend: ["frontend", "client", "ui", "ux", "react", "next", "tailwind", "css", "html", "interface", "design", "figma", "wireframe", "prototype"],
  mobile: ["mobile", "app", "apps", "android", "ios", "react native", "flutter", "expo", "native"],
  iot: ["iot", "websocket", "websockets", "real-time", "realtime", "sensor", "mqtt", "prometheus", "grafana", "monitoring", "dashboard"],
  devops: ["devops", "deploy", "jenkins", "docker", "ci/cd", "cicd", "git", "github", "postman"],
  experience: ["experience", "work", "job", "career", "history", "employ", "company", "companies", "role", "roles", "position", "positions"],
  projects: ["projects", "built", "made", "created", "portfolio", "luxurystay", "plant palace", "taverna"],
  education: ["education", "degree", "study", "university", "college", "school", "qualification", "diploma", "aptech"],
  contact: ["contact", "hire", "email", "linkedin", "github", "reach", "phone", "number", "address", "meet", "call"],
  pricing: ["price", "pricing", "cost", "charge", "rate", "rates", "salary", "fee", "fees", "money", "budget", "expensive", "dollar", "dollars", "pkr", "rupees", "how much"],
  greeting: ["hi", "hello", "hey", "greet", "salam", "assalam", "yo", "morning", "evening", "afternoon"],
  how_are_you: ["how are you", "how r u", "how you doing", "how is it going", "how is you", "are you fine", "how are u"]
}

// ─── Scoring Engine ────────────────────────────────────────────────────────────
type Intent =
  | "greeting"
  | "how_are_you"
  | "pricing"
  | "skills"
  | "experience"
  | "current_job"
  | "projects"
  | "education"
  | "contact"
  | "mobile"
  | "backend"
  | "frontend"
  | "iot"
  | "devops"
  | "design"
  | "summary"
  | "availability"
  | "location"
  | "about"
  | "unknown"

function scoreIntents(input: string, lastIntent: string): { intent: Intent; score: number }[] {
  const t = input.toLowerCase().trim()
  const scores: Record<Intent, number> = {
    greeting: 0,
    how_are_you: 0,
    pricing: 0,
    skills: 0,
    experience: 0,
    current_job: 0,
    projects: 0,
    education: 0,
    contact: 0,
    mobile: 0,
    backend: 0,
    frontend: 0,
    iot: 0,
    devops: 0,
    design: 0,
    summary: 0,
    availability: 0,
    location: 0,
    about: 0,
    unknown: 0,
  }

  // 1. Scoring based on exact matches or synonym matches
  Object.keys(SYNONYMS).forEach((key) => {
    const intent = key as Intent
    const keywords = SYNONYMS[intent]
    if (keywords) {
      keywords.forEach((keyword) => {
        if (t.includes(keyword)) {
          scores[intent] += 2
        }
      })
    }
  })

  // 2. Intent-specific weights and phrase detections
  if (/\b(hi|hello|hey|yo|salam|helo)\b/.test(t)) scores.greeting += 5
  if (/\b(how\s*(are|r)\s*(you|u)|how\s*you\s*doing|how\s*is\s*it\s*going)\b/.test(t)) scores.how_are_you += 8
  if (/\b(charge|cost|price|rate|fee|salary|budget|pricing|how\s*much|pkr|usd|\$)\b/.test(t)) scores.pricing += 8
  if (/\b(current|now|present|latest|today|asani|kwsc)\b/.test(t)) scores.current_job += 5
  if (/\b(work|experience|job|career|employ|history)\b/.test(t)) scores.experience += 4
  if (/\b(project|built|portfolio|made|created)\b/.test(t)) scores.projects += 4
  if (/\b(email|linkedin|github|phone|number|contact|hire)\b/.test(t)) scores.contact += 4
  if (/\b(react native|mobile|app|expo|android|ios)\b/.test(t)) scores.mobile += 4
  if (/\b(websocket|iot|real-time|dashboard|prometheus|grafana)\b/.test(t)) scores.iot += 4

  // Custom queries: "Why hire Ayesha?" or "Why should we hire her?"
  if (t.includes("why hire") || t.includes("why should we") || t.includes("choose ayesha") || t.includes("why choose")) {
    scores.availability += 6
    scores.experience += 3
    scores.skills += 3
  }

  // 3. Conversational Memory: If pronouns/adverbs are used ("it", "them", "where", "pricing"), boost the last intent
  const pronouns = ["it", "them", "that", "this", "there", "she", "her", "where", "what about", "how much", "charges"]
  const hasPronoun = pronouns.some(p => t.includes(p))
  if (hasPronoun && lastIntent && scores[lastIntent as Intent] !== undefined) {
    scores[lastIntent as Intent] += 3
  }

  // Filter out zero scores and sort descending
  return Object.entries(scores)
    .map(([intent, score]) => ({ intent: intent as Intent, score }))
    .filter((item) => item.score > 0 && item.intent !== "unknown")
    .sort((a, b) => b.score - a.score)
}

// ─── Response Generator ─────────────────────────────────────────────────────────
function generateCompositeResponse(
  input: string,
  lastIntent: string,
  setLastIntent: (intent: string) => void
): string {
  const scored = scoreIntents(input, lastIntent)

  if (scored.length === 0) {
    return `Ayesha is a **Full Stack Software Engineer** based in Karachi, specializing in Next.js, FastAPI, and React Native. She's open to full-time roles, freelance projects, and collaborations.\n\nYou can contact her at **ayeshaafzal1573@gmail.com** or via the contact form below!`
  }

  // Choose the highest scoring intents (max 2 intents that score close to the top)
  const topScore = scored[0].score
  const primaryIntent = scored[0].intent

  // Set memory context
  setLastIntent(primaryIntent)

  const activeIntents = scored
    .filter((item) => item.score >= Math.max(3, topScore - 2))
    .slice(0, 2)
    .map((item) => item.intent)

  // Construct response parts
  const responseParts: string[] = []

  const greetings = [
    "Hey! 👋",
    "Hello there! ✨",
    "Yo! Great to see you! 🚀",
    "Hi, nice to meet you! 👋",
    "Hey there! Ready to explore? 🌟"
  ]
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]

  if (activeIntents.includes("greeting")) {
    responseParts.push(`${randomGreeting} I am Ayesha's AI Copilot. She is a Full Stack Developer specializing in Next.js, FastAPI, and React Native. How can I help you explore her portfolio today?`)
  }

  if (activeIntents.includes("how_are_you")) {
    responseParts.push(`I'm doing fantastic, thank you for asking! 😊 Fully charged and ready to answer any questions you have about Ayesha's professional work, skills, or projects.`)
  }

  if (activeIntents.includes("pricing")) {
    responseParts.push(`**Ayesha's Services & Freelance Pricing:**\n\n• **Freelance Rates**:\n  - Hourly Rate: **${PRICING.freelance.hourly}**\n  - Monthly Retainer: **${PRICING.freelance.monthly}**\n\n• **Project Packages (Estimates)**:\n${PRICING.services.map((s) => `  - ${s.title}: **${s.price}**`).join("\n")}\n\n_All pricing is flexible depending on scope and specs. Reach out to Ayesha at **ayeshaafzal1573@gmail.com** for a tailored quote!_`)
  }

  if (activeIntents.includes("skills") && !activeIntents.includes("mobile") && !activeIntents.includes("backend") && !activeIntents.includes("frontend")) {
    responseParts.push(`Ayesha's technical expertise spans:\n\n• **Mobile:** ${KB.skills.mobile.join(", ")}\n• **Frontend:** ${KB.skills.frontend.join(", ")}\n• **Backend:** ${KB.skills.backend.join(", ")}\n• **Databases:** ${KB.skills.databases.join(", ")}\n• **DevOps:** ${KB.skills.devops.join(", ")}\n• **IoT/Real-Time:** ${KB.skills.iot.join(", ")}`)
  }

  if (activeIntents.includes("mobile")) {
    responseParts.push(`**Mobile App Development:**\nAyesha is a specialist in **React Native** (Expo, Supabase, Zustand) with **${KB.stats.apps} production mobile apps** deployed! She built travel apps at Trippy, inventory/dispatch tools at UpperCubes, and client apps for Aligarh Institute and Nazeer Hussain University.`)
  }

  if (activeIntents.includes("backend")) {
    responseParts.push(`**Backend Engineering:**\nShe has built robust backends using **Fastify, Node.js, Express.js, and FastAPI (Python)**. She specializes in writing high-concurrency APIs, designing optimized schemas in PostgreSQL and MongoDB, and securing endpoints using JWT/OAuth.`)
  }

  if (activeIntents.includes("frontend")) {
    responseParts.push(`**Frontend Development:**\nHer frontend stack centers around **Next.js, React.js, TypeScript, and Tailwind CSS**. She focuses on performance, accessibility, SEO best practices, and converting Figma designs into clean, responsive web pages.`)
  }

  if (activeIntents.includes("iot")) {
    responseParts.push(`**Real-Time & IoT Systems:**\nAt Asani.io, she built a high-concurrency Fastify backend for the KWSC Unified App, pulling live water utility infrastructure tracking metrics, and set up Prometheus & Grafana for system-level monitoring.`)
  }

  if (activeIntents.includes("devops")) {
    responseParts.push(`**DevOps & Tooling:**\nShe automates workflows using **Jenkins** pipelines, monitors cloud logs, manages version control with Git/GitHub, and conducts automated API regression tests in Postman.`)
  }

  if (activeIntents.includes("design")) {
    responseParts.push(`**UI/UX Design:**\nWith experience starting as a UI designer, she crafts user journeys, wireframes, and interactive components in **Figma** before building them, guaranteeing high visual fidelity and pixel-perfect layouts.`)
  }

  if (activeIntents.includes("current_job")) {
    responseParts.push(`**Current Role at Asani.io:**\nAyesha is currently a Full Stack Developer at Asani.io (Jul 2025 – Present), engineering real-time Fastify endpoints for water utility data and configuring Prometheus + Grafana cloud alerts.`)
  }

  if (activeIntents.includes("experience") && !activeIntents.includes("current_job")) {
    const rolesText = KB.experience.map(e => `• **${e.role}** at _${e.company}_ (${e.period})`).join("\n")
    responseParts.push(`**Work Experience:**\nAyesha has ${KB.stats.years} years of professional experience across several technical roles:\n\n${rolesText}`)
  }

  if (activeIntents.includes("projects")) {
    const projList = KB.projects.slice(0, 5).map(p => `• **${p.name}**: ${p.desc}`).join("\n")
    responseParts.push(`**Key Projects:**\nHere are some of Ayesha's outstanding projects:\n\n${projList}\n\nScroll up to view all project card sliders!`)
  }

  if (activeIntents.includes("education")) {
    const eduList = KB.education.map(e => `• **${e.degree}** — _${e.inst}_ (${e.period})`).join("\n")
    responseParts.push(`**Education:**\n${eduList}`)
  }

  if (activeIntents.includes("contact") && !activeIntents.includes("pricing")) {
    responseParts.push(`**Contact & Hiring:**\nYou can hire or get in touch with Ayesha via:\n• **Email:** ${KB.email}\n• **LinkedIn:** ${KB.linkedin}\n• **GitHub:** ${KB.github}\n• \n\nFeel free to fill out the **Get In Touch** form at the bottom of the page!`)
  }

  if (activeIntents.includes("availability")) {
    responseParts.push(`**Why Hire Ayesha?**\nAyesha combines design thinking with deep full-stack engineering skills. She has a proven track record of deploying **8+ production mobile apps** and handling complex **real-time/IoT backends** at Asani.io.\n\nShe is fully available for **Full-time engineering roles** (remote/hybrid) and **freelance projects**.`)
  }

  if (activeIntents.includes("location")) {
    responseParts.push(`Ayesha is located in **Karachi, Pakistan** 🇵🇰 and handles local hybrid work as well as full-time remote contracts for global clients.`)
  }

  if (activeIntents.includes("about") && !activeIntents.includes("greeting") && !activeIntents.includes("availability")) {
    responseParts.push(`**About Ayesha:**\n${KB.summary}`)
  }

  let response = responseParts.join("\n\n")

  if (!response) {
    response = `Ayesha is a **Full Stack Engineer** from Karachi. She specializes in MERN stack, Next.js, and React Native development. What details would you like to explore?`
  }

  // 4. Dynamic Contextual Follow-up System
  const followups: Record<string, string[]> = {
    greeting: ["Ask about her tech stack", "See her work experience", "How to contact her?"],
    how_are_you: ["Check her core skills", "What projects has she done?"],
    pricing: ["Ask how to contact her", "See her React Native apps", "Why hire Ayesha?"],
    skills: ["Tell me about her mobile apps", "What backend systems has she built?"],
    mobile: ["What projects has she built?", "Check her backend stack", "Ask about her rates"],
    backend: ["See her current job", "What databases does she use?", "Ask about her pricing"],
    iot: ["See her DevOps experience", "What backend tech did she use?", "Check her rates"],
    experience: ["Why hire Ayesha?", "Tell me about her Next.js projects"],
    projects: ["Ask about her rates", "How can I contact her?"],
    availability: ["Ask about her pricing", "How to get in touch?"],
  }

  const options = followups[primaryIntent] || ["Check her tech stack", "See her projects", "Ask about her pricing"]
  response += `\n\n**Would you like to hear about:**\n` + options.map(opt => `• ${opt}`).join("\n")

  return response
}

// ─── Format Renderer ────────────────────────────────────────────────────────────
function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []

  lines.forEach((line, i) => {
    if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />)
      return
    }

    const renderInline = (str: string) => {
      const parts = str.split(/(\*\*.*?\*\*|_.*?_)/)
      return parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={j} className="text-[color:var(--accent-primary)] font-bold">{part.slice(2, -2)}</strong>
        if (part.startsWith("_") && part.endsWith("_"))
          return <em key={j} className="italic text-[color:var(--text-secondary)]">{part.slice(1, -1)}</em>
        return part
      })
    }

    if (line.startsWith("• ") || line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex gap-2 mb-1.5 leading-relaxed text-xs">
          <span className="text-[color:var(--accent-primary)] font-bold flex-shrink-0">•</span>
          <span>{renderInline(line.replace(/^[•\-] /, ""))}</span>
        </div>
      )
    } else {
      elements.push(<div key={i} className="mb-1.5 leading-relaxed text-xs">{renderInline(line)}</div>)
    }
  })

  return <div className="space-y-0.5">{elements}</div>
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi there! 👋 I'm Ayesha's AI Assistant. Ask me anything about her skills, experience, or projects!",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Contextual memory tracking
  const [conversationContext, setConversationContext] = useState<{
    lastIntent: string
    discussedTopics: string[]
  }>({
    lastIntent: "",
    discussedTopics: [],
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return

    const userMsg: Message = { sender: "user", text: textToSend, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Calculate natural delay based on response content length
    const rawResponse = generateCompositeResponse(
      textToSend,
      conversationContext.lastIntent,
      (newIntent) => {
        setConversationContext((prev) => ({
          lastIntent: newIntent,
          discussedTopics: prev.discussedTopics.includes(newIntent)
            ? prev.discussedTopics
            : [...prev.discussedTopics, newIntent],
        }))
      }
    )

    const typingDelay = Math.min(2400, Math.max(800, 300 + textToSend.length * 15))

    setTimeout(() => {
      const botMsg: Message = {
        sender: "bot",
        text: rawResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, typingDelay)
  }

  const handleReset = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi there! 👋 I'm Ayesha's AI Assistant. Ask me anything about her skills, experience, or projects!",
        timestamp: new Date(),
      },
    ])
    setConversationContext({
      lastIntent: "",
      discussedTopics: [],
    })
  }

  const showPresets = messages.length <= 1

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full btn-primary text-white shadow-lg hover:scale-110 transition-all duration-300 animate-pulse hover:shadow-[0_0_20px_var(--accent-primary)] cursor-pointer"
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[340px] md:w-[340px] h-[70vh] sm:h-[500px] md:h-[560px] max-h-[500px] rounded-3xl glass-card flex flex-col border border-[color:var(--card-border)] bg-[color-mix(in_srgb,var(--surface-strong)_95%,transparent)] backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[color:var(--card-border)] bg-gradient-to-r from-[color:var(--accent-primary)] to-[color:var(--accent-secondary)] text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div>
                <h3 className="font-sora font-extrabold text-sm tracking-wide">Ayesha&apos;s Copilot</h3>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                  AI Assistant • Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleReset} title="Reset conversation" className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === "user" ? "ml-auto flex-row-reverse max-w-[88%]" : "mr-auto max-w-[95%]"} animate-in fade-in duration-200`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.sender === "user" ? "bg-[color:var(--accent-primary)] text-white" : "chip"}`}>
                  {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 ${msg.sender === "user" ? "bg-[color:var(--accent-primary)] text-white rounded-tr-none text-xs font-medium" : "glass-card text-[color:var(--text-primary)] rounded-tl-none border-[color:var(--card-border)]"}`}>
                  {msg.sender === "user"
                    ? <p className="text-xs font-medium">{msg.text}</p>
                    : <FormattedText text={msg.text} />
                  }
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full chip">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="glass-card rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center border-[color:var(--card-border)]">
                  <span className="w-1.5 h-1.5 bg-[color:var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[color:var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[color:var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Presets */}
          {showPresets && (
            <div className="p-3 border-t border-[color:var(--card-border)] bg-[color-mix(in_srgb,var(--accent-soft)_20%,transparent)] shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[color:var(--text-secondary)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[color:var(--accent-primary)]" />
                Quick Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q.query}
                    onClick={() => handleSendMessage(q.query)}
                    disabled={isTyping}
                    className="text-[10px] font-bold text-[color:var(--text-primary)] bg-white/70 dark:bg-slate-900/60 border border-[color:var(--card-border)] hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-soft)] px-2.5 py-1.5 rounded-full transition-all duration-200 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue) }}
            className="p-3 border-t border-[color:var(--card-border)] flex gap-2 items-center shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about Ayesha..."
              disabled={isTyping}
              className="flex-1 rounded-full px-4 py-2 text-xs outline-none border border-[color:var(--card-border)] bg-[color-mix(in_srgb,var(--surface-strong)_80%,transparent)] focus:border-[color:var(--accent-primary)] text-[color:var(--text-primary)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="h-8 w-8 flex items-center justify-center rounded-full btn-primary text-white disabled:opacity-50 hover:scale-110 transition-transform cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}