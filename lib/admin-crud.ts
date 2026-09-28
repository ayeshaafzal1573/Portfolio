import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"

const ALL_ROWS = "00000000-0000-0000-0000-000000000000"

/**
 * Replaces every row in `table` with `rows` in one request.
 *
 * Validates the payload before deleting anything, and checks the delete result
 * so a failed wipe can never be followed by an insert that silently duplicates
 * rows. Refuses an empty payload unless `allowEmpty` is set, which would
 * otherwise destroy the entire table.
 */
export async function replaceAllRows({
  supabase,
  table,
  rows,
  allowEmpty = false,
}: {
  supabase: SupabaseClient
  table: string
  rows: Record<string, unknown>[]
  allowEmpty?: boolean
}): Promise<NextResponse> {
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: "Payload must be an array" }, { status: 400 })
  }

  if (rows.length === 0 && !allowEmpty) {
    return NextResponse.json(
      { error: `Refusing to save an empty list to ${table}. Existing rows were left unchanged.` },
      { status: 400 }
    )
  }

  const { error: deleteError } = await supabase.from(table).delete().neq("id", ALL_ROWS)
  if (deleteError) {
    console.error(`[${table}] delete failed, aborting before insert:`, deleteError)
    return NextResponse.json(
      { error: `Failed to clear ${table}. Existing rows were left unchanged.` },
      { status: 500 }
    )
  }

  if (rows.length === 0) return NextResponse.json({ success: true, count: 0 })

  const { error: insertError } = await supabase.from(table).insert(rows)
  if (insertError) {
    console.error(`[${table}] insert failed after delete:`, insertError)
    return NextResponse.json({ error: `Failed to save ${table}` }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: rows.length })
}

/** Normalizes a TEXT[] column, accepting an array or a comma-separated string. */
export function toTextArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string")
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

export function failWith(
  context: string,
  error: unknown,
  message: string,
  status = 500
): NextResponse {
  console.error(`[${context}]`, error)
  return NextResponse.json({ error: message }, { status })
}
