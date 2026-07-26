import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("typing_roles").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json([
      { id: "1", role: "Full-Stack Software Engineer", sort_order: 0 },
      { id: "2", role: "MERN Stack Specialist", sort_order: 1 },
      { id: "3", role: "Next.js Architect", sort_order: 2 },
      { id: "4", role: "React Native Developer", sort_order: 3 },
      { id: "5", role: "UI/UX Designer", sort_order: 4 },
    ])
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { roles } = await request.json()
    // Delete all existing and re-insert
    await supabase.from("typing_roles").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    const rows = roles.map((role: string, i: number) => ({ role, sort_order: i }))
    const { error } = await supabase.from("typing_roles").insert(rows)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save roles" }, { status: 500 })
  }
}
