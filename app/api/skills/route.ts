import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("skills").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch {
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
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { skills } = await request.json()

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: "Refusing to save an empty skills list. Existing skills were left unchanged." },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from("skills")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
    if (deleteError) throw deleteError

    const rows = skills.map((s: Record<string, unknown>, i: number) => ({
      name: s.name,
      level: s.level,
      icon: s.icon,
      sort_order: i,
    }))
    const { error } = await supabase.from("skills").insert(rows)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
  }
}
