import { NextResponse } from "next/server"
import { DEFAULT_CONFIG, normalizeConfig, type ThemeConfig } from "@/lib/theme"

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data } = await supabase
      .from("theme_settings")
      .select("theme")
      .eq("id", SINGLETON_ID)
      .maybeSingle()
    return NextResponse.json({ config: normalizeConfig(data?.theme) })
  } catch {
    return NextResponse.json({ config: DEFAULT_CONFIG })
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const body = await request.json()
    const config = normalizeConfig(body.config) as ThemeConfig
    const { error } = await supabase
      .from("theme_settings")
      .upsert(
        { id: SINGLETON_ID, theme: config, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      )
    if (error) throw error
    return NextResponse.json({ success: true, config })
  } catch {
    return NextResponse.json({ error: "Failed to save theme config" }, { status: 500 })
  }
}