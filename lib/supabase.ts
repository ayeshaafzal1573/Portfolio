import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env"
    )
  }

  supabaseInstance = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return supabaseInstance
}

export const isSupabaseConfigured = () => {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (!!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  )
}

// Export a default client for backward compatibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// Types
// ============================================================

export type Profile = {
  id: string
  name: string
  intro_label: string
  subtitle: string
  description: string
  cta_text: string
  profile_image: string
  updated_at: string
}

export type TypingRole = {
  id: string
  role: string
  sort_order: number
  created_at: string
}

export type About = {
  id: string
  description: string
  updated_at: string
}

export type TimelineEntry = {
  id: string
  year: string
  title: string
  description: string
  skills: string[]
  sort_order: number
  created_at: string
}

export type Skill = {
  id: string
  name: string
  level: number
  icon: string
  sort_order: number
  created_at: string
}

export type EducationEntry = {
  id: string
  degree: string
  institution: string
  duration: string
  grade: string
  description: string
  badges: string[]
  icon: string
  color: string
  sort_order: number
  created_at: string
}

export type LiveProject = {
  id: string
  name: string
  thumbnail_url: string
  live_url: string
  sort_order: number
  created_at: string
}

export type CategorizedProject = {
  id: string
  title: string
  description: string
  category: string
  tech_stack: string[]
  demo_url: string
  github_url: string
  image_url: string
  video_url: string
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ContactInfo = {
  id: string
  email: string
  phone: string
  heading: string
  subtitle: string
  resume_url: string
  updated_at: string
}

export type SocialLink = {
  id: string
  platform: string
  url: string
  label: string
  sort_order: number
  created_at: string
}

export type ContactSubmission = {
  name: string
  email: string
  subject: string
  message: string
}

export type SiteSettings = {
  id: string
  brand_name: string
  footer_text: string
  updated_at: string
}

export type ThemeColors = {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}

export type ThemeSettings = {
  id: string
  theme: {
    pastel: ThemeColors
    dark: ThemeColors
    "girly-blue": ThemeColors
  }
  updated_at: string
}

export type Project = {
  id: string
  title: string
  description: string
  tech_stack: string[]
  demo_url?: string
  github_url?: string
  image_url?: string
  is_featured: boolean
  created_at: string
}
