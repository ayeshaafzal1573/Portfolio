import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("skills").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("skills", error, "Failed to load skills")
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
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("skills", error, "Failed to create skill")
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const { replaceAllRows } = await import("@/lib/admin-crud")
    const supabase = getSupabase()
    const { skills } = await request.json()

    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: "`skills` must be an array" }, { status: 400 })
    }

    const invalidIndex = skills.findIndex(
      (s: Record<string, unknown>) => typeof s?.name !== "string" || !s.name.trim()
    )
    if (invalidIndex !== -1) {
      return NextResponse.json(
        { error: `Skill at index ${invalidIndex} is missing a valid name` },
        { status: 400 }
      )
    }

    const rows = skills.map((s: Record<string, unknown>, i: number) => ({
      name: s.name,
      level: s.level,
      icon: s.icon,
      sort_order: i,
    }))

    return await replaceAllRows({ supabase, table: "skills", rows })
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("skills", error, "Failed to save skills")
  }
}
