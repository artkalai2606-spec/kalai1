import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { id } = body as { id?: number | string }
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  // RLS will ensure the user can only touch notes they can SELECT
  const { error } = await supabase.rpc("increment_views", { p_note_id: Number(id) })
  if (error) {
    return NextResponse.json({ error: "Failed to increment views", detail: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
