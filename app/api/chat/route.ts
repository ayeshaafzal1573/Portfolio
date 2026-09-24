import { NextResponse } from "next/server"
import { DEFAULT_CONFIG, normalizeConfig, type ChatbotConfig } from "@/lib/theme"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface Knowledge {
  name: string
  roles: string[]
  summary: string
  skills: string[]
  experience: { year: string; title: string; description?: string }[]
  education: { degree: string; institution: string; duration: string; grade?: string }[]
  projects: { title: string; description?: string; tech_stack?: string[]; demo_url?: string }[]
  live: { name: string; live_url?: string }[]
  email: string
  phone: string
  social: { platform: string; url?: string }[]
  chatbot: ChatbotConfig
}

const EMPTY_KNOWLEDGE: Knowledge = {
  name: "Ayesha Afzal",
  roles: [],
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  live: [],
  email: "ayeshaafzal1573@gmail.com",
  phone: "",
  social: [],
  chatbot: normalizeConfig(null).chatbot,
}

async function buildKnowledge(): Promise<Knowledge> {
  const { getSupabase } = await import("@/lib/supabase")
  const supabase = getSupabase()

  try {
    const [profiles, roles, about, skills, timeline, education, projects, live, contact, social, theme] =
      await Promise.all([
        supabase.from("profiles").select("*").limit(1),
        supabase.from("typing_roles").select("role").order("sort_order"),
        supabase.from("about").select("description").limit(1),
        supabase.from("skills").select("name").order("sort_order"),
        supabase.from("timeline_entries").select("year,title,description").order("sort_order"),
        supabase.from("education_entries").select("degree,institution,duration,grade").order("sort_order"),
        supabase.from("categorized_projects").select("title,description,tech_stack,demo_url").order("sort_order"),
        supabase.from("live_projects").select("name,live_url").order("sort_order"),
        supabase.from("contact_info").select("email,phone").limit(1),
        supabase.from("social_links").select("platform,url").order("sort_order"),
        supabase.from("theme_settings").select("theme").limit(1),
      ])

    if (profiles.error && about.error) return { ...EMPTY_KNOWLEDGE }

    const rawContact = (contact.data?.[0] || {}) as { email?: string; phone?: string }
    const rawChatbot = normalizeConfig(theme.data?.[0]?.theme).chatbot

    return {
      name: profiles.data?.[0]?.name || "Ayesha Afzal",
      roles: roles.data?.map((r: { role: string }) => r.role) || [],
      summary:
        about.data?.[0]?.description ||
        profiles.data?.[0]?.description ||
        "",
      skills: skills.data?.map((s: { name: string }) => s.name) || [],
      experience: (timeline.data || []) as Knowledge["experience"],
      education: (education.data || []) as Knowledge["education"],
      projects: (projects.data || []) as Knowledge["projects"],
      live: (live.data || []) as Knowledge["live"],
      email: rawContact.email || "ayeshaafzal1573@gmail.com",
      phone: rawContact.phone || "",
      social: (social.data || []) as Knowledge["social"],
      chatbot: rawChatbot,
    }
  } catch {
    return { ...EMPTY_KNOWLEDGE }
  }
}

function renderKnowledge(k: Awaited<ReturnType<typeof buildKnowledge>>) {
  const lines: string[] = [`Name: ${k.name}`, `Roles: ${k.roles.join(", ") || "Full-Stack Engineer"}`]
  if (k.summary) lines.push(`Summary: ${k.summary}`)
  if (k.skills.length) lines.push(`Core skills: ${k.skills.join(", ")}`)
  if (k.education.length) {
    lines.push(
      "Education: " +
        k.education
          .map((e: { degree: string; institution: string; duration: string; grade?: string }) => `${e.degree} — ${e.institution} (${e.duration})${e.grade ? `, ${e.grade}` : ""}`)
          .join(" | ")
    )
  }
  if (k.experience.length) {
    lines.push(
      "Experience: " +
        k.experience
          .map((e: { year: string; title: string; description?: string }) => `${e.year}: ${e.title}${e.description ? ` — ${e.description}` : ""}`)
          .join(" | ")
    )
  }
  if (k.projects.length) {
    lines.push(
      "Projects: " +
        k.projects
          .map((p: { title: string; description?: string; tech_stack?: string[] }) => `${p.title}${p.description ? ` (${p.description})` : ""}${p.tech_stack?.length ? ` — ${p.tech_stack.join(", ")}` : ""}`)
          .join(" | ")
    )
  }
  if (k.live.length) {
    lines.push(
      "Live production apps: " + k.live.map((l: { name: string; live_url?: string }) => `${l.name}${l.live_url ? ` (${l.live_url})` : ""}`).join(" | ")
    )
  }
  if (k.email) lines.push(`Contact email: ${k.email}`)
  if (k.phone) lines.push(`Contact phone: ${k.phone}`)
  if (k.social.length) {
    lines.push("Social links: " + k.social.map((s: { platform: string; url?: string }) => `${s.platform}${s.url ? ` (${s.url})` : ""}`).join(" | "))
  }
  return lines.join("\n")
}

async function callGemini(
  apiKey: string,
  model: string,
  system: string,
  history: ChatMessage[]
) {
  const base = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}`
  const isApiKey = apiKey.startsWith("AIza")
  const url = isApiKey ? `${base}:generateContent?key=${apiKey}` : `${base}:generateContent`

  const contents = history.slice(-12).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 900,
      topP: 0.95,
    },
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(isApiKey ? {} : { Authorization: `Bearer ${apiKey}` }),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 300)}`)
  }

  const json = await res.json()
  const text: string | undefined =
    json?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text)
      .filter(Boolean)
      .join("") || undefined
  if (!text) throw new Error("Gemini returned an empty response")
  return text
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []
    const apiKey = process.env.GEMINI_API_KEY

    const knowledge = await buildKnowledge()

    // Build the knowledge + system instruction.
    const persona = knowledge.chatbot.botName || DEFAULT_CONFIG.chatbot.botName
    const system = [
      `You are "${persona}", the official AI assistant of Ayesha Afzal's portfolio website.`,
      "Answer questions about her skills, experience, projects, education, live apps, pricing advice points, and contact details.",
      "Stay in character and be warm, friendly and concise. Format answers with short lines and use markdown bold **...** for key items and '- ' bullets for lists.",
      "Use ONLY the knowledge below. If you do not know something, say so and suggest asking about her skills or projects.",
      "You may reply in English, Urdu, or a mix — mirror the visitor's language.",
      "",
      "KNOWLEDGE:",
      renderKnowledge(knowledge),
    ].join("\n")

    // No key configured — client falls back to its local rules.
    if (!apiKey) {
      return NextResponse.json({ fallback: true })
    }

    const lastUser = messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "hi"
    const history = messages.slice(-12).reduce<ChatMessage[]>((acc, m) => {
      const prev = acc[acc.length - 1]
      if (!prev || prev.role !== m.role) acc.push(m)
      return acc
    }, [])
    if (history[0]?.role !== "user") history.unshift({ role: "user", content: lastUser })

    const text = await callGemini(apiKey, knowledge.chatbot.model || "gemini-2.0-flash", system, history)
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ fallback: true })
  }
}