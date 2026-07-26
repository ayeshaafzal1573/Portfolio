// lib/useConfig.ts - React hooks for fetching portfolio data from Supabase
"use client"

import { useEffect, useState, useCallback } from "react"
import {
  type Profile,
  type TypingRole,
  type About,
  type TimelineEntry,
  type Skill,
  type EducationEntry,
  type LiveProject,
  type CategorizedProject,
  type ContactInfo,
  type SocialLink,
  type SiteSettings,
  type ThemeSettings,
} from "@/lib/supabase"

// Generic fetch hook
function useFetch<T>(url: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const json = await resp.json()
      setData(json)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    refetch()
    const handler = () => refetch()
    window.addEventListener("portfolioConfigUpdated", handler)
    return () => window.removeEventListener("portfolioConfigUpdated", handler)
  }, [refetch, ...deps])

  return { data, loading, error, refetch }
}

// Profile hook
export function useProfile() {
  return useFetch<Profile>("/api/profile")
}

// Typing roles hook
export function useTypingRoles() {
  return useFetch<TypingRole[]>("/api/typing-roles")
}

// About hook
export function useAbout() {
  return useFetch<About>("/api/about")
}

// Timeline entries hook
export function useTimelineEntries() {
  return useFetch<TimelineEntry[]>("/api/timeline")
}

// Skills hook
export function useSkills() {
  return useFetch<Skill[]>("/api/skills")
}

// Education entries hook
export function useEducationEntries() {
  return useFetch<EducationEntry[]>("/api/education")
}

// Live projects hook
export function useLiveProjects() {
  return useFetch<LiveProject[]>("/api/live-projects")
}

// Categorized projects hook
export function useCategorizedProjects() {
  return useFetch<CategorizedProject[]>("/api/projects")
}

// Contact info hook
export function useContactInfo() {
  return useFetch<ContactInfo>("/api/contact-info")
}

// Social links hook
export function useSocialLinks() {
  return useFetch<SocialLink[]>("/api/social-links")
}

// Site settings hook
export function useSiteSettings() {
  return useFetch<SiteSettings>("/api/site-settings")
}

// Theme settings hook
export function useThemeSettings() {
  return useFetch<ThemeSettings>("/api/theme")
}
