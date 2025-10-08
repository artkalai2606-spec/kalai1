import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { noteId, reset } = body as { noteId?: string | number; reset?: ("viewers" | "views" | "downloads")[] }
  if (!noteId || !reset?.length) {
    return NextResponse.json({ error: "noteId and reset[] are required" }, { status: 400 })
  }

  // Owner or admin
  const { data: note, error: noteErr } = await supabase.from("notes").select("owner_id").eq("id", noteId).maybeSingle()
  if (noteErr) return NextResponse.json({ error: "Failed to load note" }, { status: 500 })
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const isOwner = note.owner_id === user.id
  let isAdmin = false
  if (!isOwner) {
    const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
    isAdmin = !!admin
  }
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  if (reset.includes("viewers")) {
    const { error } = await supabase.from("notes_acl").delete().eq("note_id", noteId)
    if (error) return NextResponse.json({ error: "Failed to reset viewers" }, { status: 500 })
  }
  if (reset.includes("views")) {
    const { error } = await supabase.from("notes").update({ views_count: 0 }).eq("id", noteId)
    if (error) return NextResponse.json({ error: "Failed to reset views" }, { status: 500 })
  }
  if (reset.includes("downloads")) {
    const { error } = await supabase.from("notes").update({ downloads_count: 0 }).eq("id", noteId)
    if (error) return NextResponse.json({ error: "Failed to reset downloads" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
