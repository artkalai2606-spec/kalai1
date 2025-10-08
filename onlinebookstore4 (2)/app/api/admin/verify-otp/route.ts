import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()

  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { candidateEmail, code } = body as { candidateEmail?: string; code?: string }
  if (!candidateEmail || !code) {
    return NextResponse.json({ error: "candidateEmail and code are required" }, { status: 400 })
  }

  // Validate OTP
  const { data: invite, error: inviteErr } = await supabase
    .from("admin_invites")
    .select("*")
    .eq("candidate_email", candidateEmail.toLowerCase())
    .eq("code", code)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (inviteErr) {
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
  if (!invite) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
  }

  // Upsert admin record
  const { error: upsertErr } = await supabase.from("admins").upsert(
    {
      user_id: user.id,
      email: (user.email || candidateEmail).toLowerCase(),
      name: user.user_metadata?.name || user.email || candidateEmail,
      created_by: invite.invited_by,
    },
    { onConflict: "user_id" },
  )
  if (upsertErr) {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }

  // mark invite as used
  const { error: useErr } = await supabase
    .from("admin_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id)

  if (useErr) {
    // Non-fatal; still return success for admin creation
    console.warn("[v0] Failed to mark invite used", useErr.message)
  }

  return NextResponse.json({ ok: true })
}
