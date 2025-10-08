import { createServerClient } from "@supabase/ssr"

export function getSupabaseAdmin() {
  // Do NOT expose SERVICE_ROLE_KEY to the browser. Server-only usage.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // elevated permissions
    {
      cookies: {
        // No-op cookie hooks for non-user flows
        getAll() {
          return []
        },
        setAll() {
          // no-op
        },
      },
    },
  )
}
