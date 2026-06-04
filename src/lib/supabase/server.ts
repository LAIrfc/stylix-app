import { createClient } from "@supabase/supabase-js";

// Returns a fresh service-role client. Called only inside request handlers
// so missing env vars throw inside a try/catch rather than at module load.
// Server-side only — never expose this client or its key to the browser.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, key);
}
