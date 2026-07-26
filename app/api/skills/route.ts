import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("skills").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const body = await request.json()
    const { data, error } = await supabase.from("skills").insert(body).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { skills } = await request.json()
    await supabase.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    const rows = skills.map((s: any, i: number) => ({ ...s, sort_order: i, id: undefined }))
    const { error } = await supabase.from("skills").insert(rows)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save skills" }, { status: 500 })
  }
}
