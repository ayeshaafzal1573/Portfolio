import { createClient } from "@supabase/supabase-js"

// Provide fallback values for development/preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "placeholder-key"

// Create client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  )
}

export type LiveProject = {
  id: string
  name: string
  thumbnail_url: string
  live_url: string
  created_at: string
}

export type CategorizedProject = {
  id: string
  title: string
  description: string
  category: "MERN Stack" | "Full-Stack" | "Mobile Apps" | "UI/UX Designs" | "Web Development"
  tech_stack: string[]
  demo_url?: string
  github_url?: string
  image_url?: string
  video_url?: string
  is_featured: boolean
  created_at: string
}

export type ContactSubmission = {
  name: string
  email: string
  subject: string
  message: string
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
