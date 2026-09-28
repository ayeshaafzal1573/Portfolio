import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("education_entries").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const body = await request.json()
    const { data, error } = await supabase.from("education_entries").insert(body).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const { replaceAllRows, toTextArray } = await import("@/lib/admin-crud")
    const supabase = getSupabase()
    const { entries } = await request.json()

    if (!Array.isArray(entries)) {
      return NextResponse.json({ error: "`entries` must be an array" }, { status: 400 })
    }

    const invalidIndex = entries.findIndex((e: Record<string, unknown>) => {
      if (!e || typeof e !== "object") return true
      const hasText = (v: unknown) => typeof v === "string" && v.trim().length > 0
      return !hasText(e.degree) || !hasText(e.institution) || !hasText(e.duration)
    })
    if (invalidIndex !== -1) {
      return NextResponse.json(
        { error: `Entry at index ${invalidIndex} is missing degree, institution, or duration` },
        { status: 400 }
      )
    }

    const rows = entries.map((e: Record<string, unknown>, i: number) => {
      const row = { ...e, sort_order: i } as Record<string, unknown>
      delete row.id
      if ("badges" in row) row.badges = toTextArray(row.badges)
      return row
    })

    return await replaceAllRows({ supabase, table: "education_entries", rows, allowEmpty: true })
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("education", error, "Failed to save entries")
  }
}
