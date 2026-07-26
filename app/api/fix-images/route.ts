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
      const { error } = await supabase
        .from("categorized_projects")
        .update({ image_url: fix.image_url, updated_at: new Date().toISOString() })
        .eq("title", fix.title)
        .is("image_url", "")
      results.push({ title: fix.title, success: !error })
    }
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fix images" }, { status: 500 })
  }
}
