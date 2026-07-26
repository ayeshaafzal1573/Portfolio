import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("social_links").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { links } = await request.json()
    await supabase.from("social_links").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    const rows = links.map((l: any, i: number) => ({ ...l, sort_order: i, id: undefined }))
    const { error } = await supabase.from("social_links").insert(rows)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save links" }, { status: 500 })
  }
}
