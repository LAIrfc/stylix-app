import { createClient } from "@supabase/supabase-js";

// Lazy singleton — avoids module-load crash when env vars are missing at runtime.
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
  _client = createClient(url, key);
  return _client;
}

// Backwards-compatible named export used by existing imports.
// Service-role client for server-side use only — never expose to the browser.
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
