import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

function generateOTP(length = 6) {
  const digits = "0123456789"
  let code = ""
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * digits.length)]
  return code
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()

  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { candidateEmail, approverEmail } = body as {
    candidateEmail?: string
    approverEmail?: string // must be an existing admin (or the creator)
  }

  if (!candidateEmail || !approverEmail) {
    return NextResponse.json({ error: "candidateEmail and approverEmail are required" }, { status: 400 })
  }

  // Verify approverEmail belongs to an admin
  const { data: approver, error: approverErr } = await supabase
    .from("admins")
    .select("*")
    .eq("email", approverEmail)
    .limit(1)
    .maybeSingle()
  if (approverErr) {
    return NextResponse.json({ error: "Failed to check approver" }, { status: 500 })
  }
  if (!approver) {
    return NextResponse.json({ error: "approverEmail is not an admin" }, { status: 403 })
  }

  const code = generateOTP(6)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

  const { error: insertErr } = await supabase.from("admin_invites").insert({
    candidate_email: candidateEmail.toLowerCase(),
    approver_email: approverEmail.toLowerCase(),
    code,
    expires_at: expiresAt,
    invited_by: user.id,
  })

  if (insertErr) {
    return NextResponse.json({ error: "Failed to create OTP" }, { status: 500 })
  }

  // TODO: Send email to approverEmail with the OTP code using your email provider (e.g., Resend)
  // For now, log so you can test quickly.
  console.log("[v0] OTP for approver", approverEmail, "code:", code)

  return NextResponse.json({ ok: true, message: "OTP sent to approver email." })
}
