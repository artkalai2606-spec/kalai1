import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()

  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const file = form.get("file") as File | null
  const title = (form.get("title") as string) || ""
  const folder = (form.get("folder") as string) || "" // optional subfolder

  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

  const key = [user.id, folder, file.name].filter(Boolean).join("/")
  const arrayBuffer = await file.arrayBuffer()

  const { error: upErr } = await supabase.storage.from("notes").upload(key, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  })
  if (upErr) return NextResponse.json({ error: "Upload failed", detail: upErr.message }, { status: 500 })

  const { data: note, error: insErr } = await supabase
    .from("notes")
    .insert({
      owner_id: user.id,
      title: title || file.name,
      storage_path: key,
      size: file.size,
    })
    .select()
    .single()

  if (insErr) return NextResponse.json({ error: "Failed to save note" }, { status: 500 })

  return NextResponse.json({ ok: true, note })
}
