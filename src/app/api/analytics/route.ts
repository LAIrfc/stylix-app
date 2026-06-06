import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export interface AnalyticsEvent {
  event_name: string;
  page_url?: string;
  product_id?: string;
  tool_name?: string;
  anonymous_user_id?: string;
  session_id?: string;
  device_type?: string;
  referrer?: string;
  country?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events: AnalyticsEvent[] = Array.isArray(body) ? body : [body];

    if (!events.length) {
      return NextResponse.json({ ok: true });
    }

    for (const ev of events) {
      if (!ev.event_name || typeof ev.event_name !== "string") {
        return NextResponse.json({ error: "event_name required" }, { status: 400 });
      }
    }

    const now = new Date().toISOString();
    const rows = events.map((ev) => ({
      event_name: ev.event_name,
      page_url: ev.page_url ?? null,
      product_id: ev.product_id ?? null,
      tool_name: ev.tool_name ?? null,
      anonymous_user_id: ev.anonymous_user_id ?? null,
      session_id: ev.session_id ?? null,
      device_type: ev.device_type ?? null,
      referrer: ev.referrer ?? null,
      country: ev.country ?? null,
      timestamp: now,
    }));

    const db = getSupabaseAdmin();
    const { error: insertError } = await db.schema("public").from("analytics_events").insert(rows);

    if (insertError) {
      console.error("[analytics] Supabase insert failed", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        eventCount: rows.length,
        firstEvent: rows[0],
      });
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[analytics] unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
