import { NextResponse } from "next/server"

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001"

export async function GET() {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", SINGLETON_ID).single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      id: SINGLETON_ID,
      name: "Ayesha Afzal",
      intro_label: "Hi, My Name Is",
      subtitle: "Full-Stack Software Engineer & UI/UX Designer",
      description: "Specialized in engineering robust architectures using the MERN Stack, Next.js, FastAPI, and cross-platform mobile apps with React Native.",
      cta_text: "Let's Build Together",
      profile_image: "",
      updated_at: new Date().toISOString(),
    })
  }
}

export async function PUT(request: Request) {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const body = await request.json()
    const { error } = await supabase
      .from("profiles")
      .upsert({ ...body, id: SINGLETON_ID, updated_at: new Date().toISOString() }, { onConflict: "id" })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}
