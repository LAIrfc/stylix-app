import { createClient } from "@supabase/supabase-js";

function getSupabaseProjectUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!rawUrl) {
    throw new Error("[supabase] NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  const url = new URL(rawUrl);
  return url.origin;
}

// Returns a fresh service-role client. Called only inside request handlers
// so missing env vars throw inside a try/catch rather than at module load.
// Server-side only — never expose this client or its key to the browser.
export function getSupabaseAdmin() {
  const url = getSupabaseProjectUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("[supabase] SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
