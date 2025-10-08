import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  // Require an authenticated admin to run setup
  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: isAdmin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const admin = getSupabaseAdmin()

  // Create private bucket "notes" if not exists
  // createBucket requires service-role key
  const { data: buckets, error: listErr } = await admin.storage.listBuckets()
  if (listErr) return NextResponse.json({ error: "Failed to list buckets", detail: listErr.message }, { status: 500 })

  const exists = buckets?.some((b: any) => b.name === "notes")
  if (!exists) {
    const { error: makeErr } = await admin.storage.createBucket("notes", { public: false })
    if (makeErr)
      return NextResponse.json({ error: "Failed to create bucket", detail: makeErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, bucket: "notes", created: !exists })
}
