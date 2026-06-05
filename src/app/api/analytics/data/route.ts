import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_CONFIGURED =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co" &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "stylix-admin-2024";

  if (token !== adminPassword) return unauthorized();

  if (!SUPABASE_CONFIGURED) {
    return NextResponse.json({ demo: true, message: "Supabase not configured." });
  }

  let db: ReturnType<typeof createClient>;
  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    db = createClient(url, key);
  } catch (err) {
    console.error("[analytics/data] supabase init error:", err);
    return NextResponse.json({ demo: true, message: "Supabase not configured." });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "30d";

  const now = new Date();
  const since = new Date(now);
  let sinceIso: string | null = null;

  if (range === "today") {
    since.setHours(0, 0, 0, 0);
    sinceIso = since.toISOString();
  } else if (range === "7d") {
    since.setDate(since.getDate() - 7);
    sinceIso = since.toISOString();
  } else if (range === "30d") {
    since.setDate(since.getDate() - 30);
    sinceIso = since.toISOString();
  } else if (range === "90d") {
    since.setDate(since.getDate() - 90);
    sinceIso = since.toISOString();
  } else if (range === "6m") {
    since.setMonth(since.getMonth() - 6);
    sinceIso = since.toISOString();
  } else if (range === "12m") {
    since.setMonth(since.getMonth() - 12);
    sinceIso = since.toISOString();
  }
  // "all" → sinceIso stays null (no date filter applied)

  function applyRange<T extends ReturnType<typeof db.from>>(q: T): T {
    if (sinceIso) return (q as unknown as { gte: (col: string, val: string) => T }).gte("timestamp", sinceIso);
    return q;
  }

  const base = () => db.from("analytics_events");

  const [
    totalEventsRes,
    uniqueVisitorsRes,
    uniqueSessionsRes,
    topPagesRes,
    topProductsRes,
    toolUsageRes,
    funnelRes,
    summaryCountsRes,
    journeyRes,
  ] = await Promise.all([
    // Total events
    (() => {
      const q = base().select("id", { count: "exact", head: true });
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Unique visitors
    (() => {
      const q = base().select("anonymous_user_id").not("anonymous_user_id", "is", null);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Unique sessions
    (() => {
      const q = base().select("session_id").not("session_id", "is", null);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Top pages
    (() => {
      const q = base().select("page_url").eq("event_name", "page_view").not("page_url", "is", null);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Top products
    (() => {
      const q = base().select("product_id").eq("event_name", "product_view").not("product_id", "is", null);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Tool usage
    (() => {
      const q = base()
        .select("event_name")
        .in("event_name", [
          "3d_viewer_open", "3d_viewer_interact",
          "tryon_start", "tryon_complete",
          "advisor_submit", "advisor_result_view",
        ]);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Full funnel
    (() => {
      const q = base()
        .select("event_name")
        .in("event_name", [
          "page_view", "product_view",
          "add_to_cart", "cart_view",
          "checkout_start", "checkout_submit", "purchase",
        ]);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // KPI summary counts (product_views, tool uses, add_to_cart, checkout_start, purchase)
    (() => {
      const q = base()
        .select("event_name")
        .in("event_name", [
          "product_view", "3d_viewer_open", "tryon_start", "advisor_submit",
          "add_to_cart", "checkout_start", "purchase",
        ]);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),

    // Journey log — last 200
    (() => {
      const q = base()
        .select("event_name, page_url, product_id, tool_name, timestamp, anonymous_user_id, session_id, device_type, referrer, country")
        .order("timestamp", { ascending: false })
        .limit(200);
      return sinceIso ? q.gte("timestamp", sinceIso) : q;
    })(),
  ]);

  // Aggregate top pages
  const pageCounts: Record<string, number> = {};
  for (const row of topPagesRes.data ?? []) {
    const url = row.page_url as string;
    pageCounts[url] = (pageCounts[url] ?? 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([url, count]) => ({ url, count }));
  const totalPageViews = Object.values(pageCounts).reduce((a, b) => a + b, 0);

  // Aggregate top products
  const productCounts: Record<string, number> = {};
  for (const row of topProductsRes.data ?? []) {
    const id = row.product_id as string;
    productCounts[id] = (productCounts[id] ?? 0) + 1;
  }
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([productId, count]) => ({ productId, count }));

  // Aggregate tool usage
  const toolCounts: Record<string, number> = {};
  for (const row of toolUsageRes.data ?? []) {
    const key = row.event_name as string;
    toolCounts[key] = (toolCounts[key] ?? 0) + 1;
  }

  // Aggregate funnel
  const funnelCounts: Record<string, number> = {};
  for (const row of funnelRes.data ?? []) {
    const key = row.event_name as string;
    funnelCounts[key] = (funnelCounts[key] ?? 0) + 1;
  }

  // Aggregate KPI summary
  const kpiCounts: Record<string, number> = {};
  for (const row of summaryCountsRes.data ?? []) {
    const key = row.event_name as string;
    kpiCounts[key] = (kpiCounts[key] ?? 0) + 1;
  }

  const uniqueVisitors = new Set((uniqueVisitorsRes.data ?? []).map((r) => r.anonymous_user_id)).size;
  const uniqueSessions = new Set((uniqueSessionsRes.data ?? []).map((r) => r.session_id)).size;

  return NextResponse.json({
    demo: false,
    range,
    since: sinceIso,
    summary: {
      totalEvents: totalEventsRes.count ?? 0,
      uniqueVisitors,
      uniqueSessions,
      productViews: kpiCounts["product_view"] ?? 0,
      toolUses:
        (kpiCounts["3d_viewer_open"] ?? 0) +
        (kpiCounts["tryon_start"] ?? 0) +
        (kpiCounts["advisor_submit"] ?? 0),
      addToCart: kpiCounts["add_to_cart"] ?? 0,
      checkoutStart: kpiCounts["checkout_start"] ?? 0,
      purchases: kpiCounts["purchase"] ?? 0,
    },
    topPages,
    totalPageViews,
    topProducts,
    toolUsage: {
      viewer3dOpen: toolCounts["3d_viewer_open"] ?? 0,
      viewer3dInteract: toolCounts["3d_viewer_interact"] ?? 0,
      tryonStart: toolCounts["tryon_start"] ?? 0,
      tryonComplete: toolCounts["tryon_complete"] ?? 0,
      advisorSubmit: toolCounts["advisor_submit"] ?? 0,
      advisorResultView: toolCounts["advisor_result_view"] ?? 0,
    },
    funnel: {
      pageView: funnelCounts["page_view"] ?? 0,
      productView: funnelCounts["product_view"] ?? 0,
      addToCart: funnelCounts["add_to_cart"] ?? 0,
      cartView: funnelCounts["cart_view"] ?? 0,
      checkoutStart: funnelCounts["checkout_start"] ?? 0,
      checkoutSubmit: funnelCounts["checkout_submit"] ?? 0,
      purchase: funnelCounts["purchase"] ?? 0,
    },
    journey: journeyRes.data ?? [],
  });
}
