import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  const { data: note, error: noteErr } = await supabase.from("notes").select("*").eq("id", id).maybeSingle()
  if (noteErr) return NextResponse.json({ error: "Failed to load note" }, { status: 500 })
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Authorization (enforced also by RLS at DB level):
  // Allow if owner or ACL grants viewer/editor to this user's email.
  const email = (user.email || "").toLowerCase()
  const owner = note.owner_id === user.id
  let allowed = owner
  if (!allowed) {
    const { data: acl, error: aclErr } = await supabase
      .from("notes_acl")
      .select("id")
      .eq("note_id", note.id)
      .eq("grantee_email", email)
      .limit(1)
    if (aclErr) return NextResponse.json({ error: "ACL check failed" }, { status: 500 })
    allowed = (acl?.length || 0) > 0
  }
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: signed, error: signErr } = await supabase.storage.from("notes").createSignedUrl(note.storage_path, 60)
  if (signErr) return NextResponse.json({ error: "Signing failed" }, { status: 500 })

  // Increment downloads_count
  const { error: updErr } = await supabase.rpc("increment_downloads", { p_note_id: note.id })
  if (updErr) {
    console.warn("[v0] Failed to increment downloads", updErr.message)
  }

  return NextResponse.json({ url: signed.signedUrl, expiresIn: 60 })
}
