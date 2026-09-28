import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("social_links").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const { replaceAllRows } = await import("@/lib/admin-crud")
    const supabase = getSupabase()
    const { links } = await request.json()

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: "`links` must be an array" }, { status: 400 })
    }

    const rows = links.map((l: Record<string, unknown>, i: number) => {
      const row = { ...l, sort_order: i } as Record<string, unknown>
      delete row.id
      return row
    })

    return await replaceAllRows({ supabase, table: "social_links", rows, allowEmpty: true })
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("social-links", error, "Failed to save links")
  }
}
