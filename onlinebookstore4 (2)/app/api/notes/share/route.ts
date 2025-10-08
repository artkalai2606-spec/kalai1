import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { noteId, emails, permission } = body as {
    noteId?: string | number
    emails?: string[]
    permission?: "viewer" | "editor"
  }
  if (!noteId || !emails?.length) {
    return NextResponse.json({ error: "noteId and emails[] are required" }, { status: 400 })
  }

  // Verify owner
  const { data: note, error: noteErr } = await supabase.from("notes").select("owner_id").eq("id", noteId).maybeSingle()
  if (noteErr) return NextResponse.json({ error: "Failed to load note" }, { status: 500 })
  if (!note || note.owner_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const rows = emails.map((e) => ({
    note_id: noteId,
    grantee_email: e.toLowerCase(),
    permission: permission || "viewer",
  }))

  const { error: insErr } = await supabase.from("notes_acl").upsert(rows, {
    onConflict: "note_id,grantee_email",
  })
  if (insErr) return NextResponse.json({ error: "Failed to share" }, { status: 500 })

  return NextResponse.json({ ok: true })
}
