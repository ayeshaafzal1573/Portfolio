import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { slugifyCaseStudy } from "@/lib/content"

export type CaseStudyProject = {
  title: string
  description: string
  category: string
  tech_stack: string[]
  demo_url?: string
  github_url?: string
  image_url?: string
}

function isValidUrl(value?: string | null): value is string {
  return !!value && value !== "#" && /^https?:\/\//.test(value)
}

/**
 * Server-side lookup of live project rows keyed by case study title.
 * Returns an empty map when Supabase is unreachable so pages still render
 * from the static case study copy in lib/content.ts.
 */
export async function getProjectsByCaseStudyTitle(): Promise<Map<string, CaseStudyProject>> {
  const map = new Map<string, CaseStudyProject>()
  if (!isSupabaseConfigured()) return map

  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from("categorized_projects")
      .select("title, description, category, tech_stack, demo_url, github_url, image_url")

    for (const row of (data || []) as CaseStudyProject[]) {
      if (row?.title) map.set(row.title.toLowerCase(), row)
    }
  } catch {
    return map
  }

  return map
}

export function matchProject(
  map: Map<string, CaseStudyProject>,
  projectTitle: string
): CaseStudyProject | undefined {
  return map.get(projectTitle.toLowerCase())
}

export function projectImageAlt(project: CaseStudyProject, role: string): string {
  const stack = (project.tech_stack || []).slice(0, 3).join(", ")
  return stack
    ? `${project.title} — ${role} case study, built with ${stack}`
    : `${project.title} — ${role} case study`
}

export function isExternalLink(value?: string | null): value is string {
  return isValidUrl(value)
}

export { slugifyCaseStudy }
