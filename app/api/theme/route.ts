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
          primaryColor: "#b0783e",
          secondaryColor: "#c68d5c",
          backgroundColor: "#f6efe4",
          textColor: "#3b2a1c",
          accentColor: "#a2653c",
        },
        dark: {
          primaryColor: "#d9a25c",
          secondaryColor: "#c0864a",
          backgroundColor: "#1b130c",
          textColor: "#eee2d0",
          accentColor: "#d9a25c",
        },
        "girly-blue": {
          primaryColor: "#c8864e",
          secondaryColor: "#d89a67",
          backgroundColor: "#f9f2e8",
          textColor: "#472e1d",
          accentColor: "#b1683b",
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
