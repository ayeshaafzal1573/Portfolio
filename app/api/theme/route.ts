import { NextResponse } from "next/server"

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("theme_settings").select("*").eq("id", SINGLETON_ID).single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      id: SINGLETON_ID,
      theme: {
        pastel: {
          primaryColor: "#d946ef",
          secondaryColor: "#a855f7",
          backgroundColor: "#faf5ff",
          textColor: "#3b0764",
          accentColor: "#d946ef",
        },
        dark: {
          primaryColor: "#38bdf8",
          secondaryColor: "#22d3ee",
          backgroundColor: "#0b1220",
          textColor: "#e2e8f0",
          accentColor: "#38bdf8",
        },
        "girly-blue": {
          primaryColor: "#2563eb",
          secondaryColor: "#0284c7",
          backgroundColor: "#f2f7ff",
          textColor: "#172554",
          accentColor: "#2563eb",
        },
      },
      updated_at: new Date().toISOString(),
    })
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const body = await request.json()
    const { error } = await supabase
      .from("theme_settings")
      .upsert({ ...body, id: SINGLETON_ID, updated_at: new Date().toISOString() }, { onConflict: "id" })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 })
  }
}
