import { NextResponse } from "next/server"

const fixes = [
  { title: "KWSC Unified App", image_url: "/kwsc.png" },
  { title: "Asani Dashboard", image_url: "/asani-dashboard.png" },
  { title: "Asani Website", image_url: "/web.png" },
]

export async function POST() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const results = []
    for (const fix of fixes) {
      const { data, error } = await supabase
        .from("categorized_projects")
        .update({ image_url: fix.image_url, updated_at: new Date().toISOString() })
        .eq("title", fix.title)
        .select()
      results.push({ title: fix.title, error: error?.message || null, updated: data?.length || 0 })
    }
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fix images" }, { status: 500 })
  }
}
