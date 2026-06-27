import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { DbOrder } from "@/lib/types/database";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session_id." }, { status: 400 });
  }

  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .schema("public")
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("[orders] lookup failed", { code: error.code, message: error.message });
      return NextResponse.json({ error: "Order lookup failed." }, { status: 500 });
    }

    return NextResponse.json({ order: (data as DbOrder) ?? null });
  } catch (err) {
    console.error("[orders] unexpected error", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
