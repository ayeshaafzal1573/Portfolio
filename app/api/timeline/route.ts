import { NextResponse } from "next/server"

type TimelineEntry = {
  year: string
  title: string
  description?: string
  skills?: string[]
}

function isValidEntry(entry: unknown): entry is TimelineEntry {
  if (!entry || typeof entry !== "object") return false
  const e = entry as Record<string, unknown>
  return typeof e.year === "string" && e.year.trim().length > 0 && typeof e.title === "string" && e.title.trim().length > 0
}

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("timeline_entries").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[timeline] GET failed:", error)
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const body = await request.json()
    if (!isValidEntry(body)) {
      return NextResponse.json({ error: "year and title are required" }, { status: 400 })
    }
    const { data, error } = await supabase.from("timeline_entries").insert(body).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[timeline] POST failed:", error)
    return NextResponse.json({ error: "Failed to create timeline entry" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  let entries: unknown
  try {
    const body = await request.json()
    entries = body?.entries
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!Array.isArray(entries)) {
    return NextResponse.json({ error: "`entries` must be an array" }, { status: 400 })
  }

  const invalidIndex = entries.findIndex((e) => !isValidEntry(e))
  if (invalidIndex !== -1) {
    return NextResponse.json(
      { error: `Entry at index ${invalidIndex} is missing a valid year or title` },
      { status: 400 }
    )
  }

  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()

    const rows = (entries as TimelineEntry[]).map((e, i) => ({
      year: e.year.trim(),
      title: e.title.trim(),
      description: e.description ?? "",
      skills: Array.isArray(e.skills) ? e.skills : [],
      sort_order: i,
    }))

    const { error: deleteError } = await supabase
      .from("timeline_entries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")
    if (deleteError) throw deleteError

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("timeline_entries").insert(rows)
      if (insertError) {
        console.error("[timeline] PUT insert failed after delete:", insertError)
        return NextResponse.json({ error: "Failed to save timeline entries" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, count: rows.length })
  } catch (error) {
    console.error("[timeline] PUT failed:", error)
    return NextResponse.json({ error: "Failed to save timeline entries" }, { status: 500 })
  }
}
