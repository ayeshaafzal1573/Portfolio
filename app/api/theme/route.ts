import { NextResponse } from "next/server"

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("theme_settings").select("*").eq("id", SINGLETON_ID).single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({
      id: SINGLETON_ID,
      theme: {
        pastel: {
          primaryColor: "#000000",
          secondaryColor: "#3f3f3f",
          backgroundColor: "#ffffff",
          textColor: "#0a0a0a",
          accentColor: "#0a0a0a",
        },
        dark: {
          primaryColor: "#ffffff",
          secondaryColor: "#d4d4d4",
          backgroundColor: "#050505",
          textColor: "#f5f5f5",
          accentColor: "#f5f5f5",
        },
        "girly-blue": {
          primaryColor: "#f5f5f5",
          secondaryColor: "#8a8a8a",
          backgroundColor: "#0d0d0d",
          textColor: "#fafafa",
          accentColor: "#fafafa",
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
  } catch {
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 })
  }
}
