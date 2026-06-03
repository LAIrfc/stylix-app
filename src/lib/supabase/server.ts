import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service-role client for server-side use only (API routes, server components).
// Never expose this client or its key to the browser.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
