import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("typing_roles").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch {
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
    const { replaceAllRows } = await import("@/lib/admin-crud")
    const supabase = getSupabase()
    const { roles } = await request.json()

    if (!Array.isArray(roles)) {
      return NextResponse.json({ error: "`roles` must be an array" }, { status: 400 })
    }

    if (roles.some((r: unknown) => typeof r !== "string" || !r.trim())) {
      return NextResponse.json(
        { error: "Every role must be a non-empty string" },
        { status: 400 }
      )
    }

    const rows = roles.map((role: string, i: number) => ({ role: role.trim(), sort_order: i }))

    return await replaceAllRows({ supabase, table: "typing_roles", rows, allowEmpty: true })
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("typing-roles", error, "Failed to save roles")
  }
}
