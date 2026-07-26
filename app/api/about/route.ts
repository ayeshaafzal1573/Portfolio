import { NextResponse } from "next/server"

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("about").select("*").eq("id", SINGLETON_ID).single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      id: SINGLETON_ID,
      description: "Full-Stack Developer & UI/UX Designer with 2+ years of experience.",
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
      .from("about")
      .upsert({ ...body, id: SINGLETON_ID, updated_at: new Date().toISOString() }, { onConflict: "id" })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save about" }, { status: 500 })
  }
}
