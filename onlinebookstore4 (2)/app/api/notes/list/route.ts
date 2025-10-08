import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer()

  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Fetch notes that the user owns or has access to via ACL
  const { data: notes, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }

  return NextResponse.json({ notes })
}
