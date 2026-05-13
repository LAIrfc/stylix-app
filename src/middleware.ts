import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Placeholder for auth, A/B, or admin route protection.
 * Future: verify Supabase session for `/admin/*` and advisor rate limits.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
