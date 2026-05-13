import { NextResponse } from "next/server";

/** Admin / ops probe — extend for DB connectivity checks post-Supabase. */
export function GET() {
  return NextResponse.json({ ok: true, service: "stylix" });
}
