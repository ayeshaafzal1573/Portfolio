import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("categorized_projects").select("*").order("sort_order")
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const { toTextArray, withTimeout } = await import("@/lib/admin-crud")
    const supabase = getSupabase()
    const body = await request.json()

    if (typeof body?.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    const now = new Date().toISOString()
    const row: Record<string, unknown> = {
      title: body.title.trim(),
      description: body.description ?? "",
      category: body.category ?? "Full-Stack",
      tech_stack: toTextArray(body.tech_stack),
      demo_url: body.demo_url ?? "",
      github_url: body.github_url ?? "",
      image_url: body.image_url ?? "",
      video_url: body.video_url ?? "",
      is_featured: body.is_featured ?? true,
      sort_order: Number(body.sort_order) || 0,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await withTimeout(
      supabase.from("categorized_projects").insert(row).select().single()
    )
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("projects", error, "Failed to create project")
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const { toTextArray, withTimeout } = await import("@/lib/admin-crud")
    const supabase = getSupabase()
    const body = await request.json()

    if (!body?.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    const patch: Record<string, unknown> = {
      title: body.title.trim(),
      updated_at: new Date().toISOString(),
    }
    for (const field of ["description", "category", "demo_url", "github_url", "image_url", "video_url"]) {
      if (field in body) patch[field] = body[field] ?? ""
    }
    if ("tech_stack" in body) patch.tech_stack = toTextArray(body.tech_stack)
    if ("is_featured" in body) patch.is_featured = Boolean(body.is_featured)
    if ("sort_order" in body) patch.sort_order = Number(body.sort_order) || 0

    const { error } = await withTimeout(
      supabase.from("categorized_projects").update(patch).eq("id", body.id)
    )
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    const { failWith } = await import("@/lib/admin-crud")
    return failWith("projects", error, "Failed to update project")
  }
}

export async function DELETE(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })
    const { error } = await supabase.from("categorized_projects").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
