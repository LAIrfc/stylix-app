// Analytics tracker — fires events to /api/analytics
// All IDs are anonymous and stored in sessionStorage/localStorage.

const ANON_ID_KEY = "stylix_anon_id";
const SESSION_ID_KEY = "stylix_session_id";

// Production hostname — events from any other host are dropped silently.
// Set NEXT_PUBLIC_SITE_URL in .env to control this.
const PRODUCTION_HOST =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/https?:\/\//, "").replace(/\/$/, "")) ||
  "stylix.app";

// Commerce events that must flush immediately, not wait for the 2s batch timer.
const IMMEDIATE_EVENTS = new Set([
  "product_view",
  "add_to_cart",
  "cart_view",
  "checkout_start",
  "checkout_submit",
  "purchase",
]);

function isProductionHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  // Always block localhost and loopback
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return false;
  // Block Vercel preview deployments (*.vercel.app) that are not the canonical domain
  if (host.endsWith(".vercel.app") && host !== PRODUCTION_HOST) return false;
  return true;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getAnonId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function getBrowser(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua)) return "edge";
  if (/opr\/|opera/i.test(ua)) return "opera";
  // Chrome must come before Safari — Chrome UA contains both "Chrome" and "Safari"
  if (/chrome|chromium|crios/i.test(ua)) return "chrome";
  if (/firefox|fxios/i.test(ua)) return "firefox";
  if (/safari/i.test(ua)) return "safari";
  return "other";
}

function getTrafficSource(): string {
  if (typeof window === "undefined") return "direct";

  // UTM source takes priority
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";
  if (utmSource) {
    if (utmSource.includes("instagram")) return "instagram";
    if (utmSource.includes("tiktok")) return "tiktok";
    if (utmSource.includes("pinterest")) return "pinterest";
    if (utmSource.includes("google")) return "google";
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "facebook";
    if (utmSource.includes("twitter") || utmSource.includes("x.com")) return "twitter";
    if (utmSource.includes("wechat") || utmSource.includes("weixin")) return "wechat";
    return "referral";
  }

  const ref = document.referrer?.toLowerCase() ?? "";
  if (!ref) return "direct";

  // Strip the referrer to hostname only for matching
  let refHost = ref;
  try { refHost = new URL(ref).hostname; } catch { /* keep as-is */ }

  if (refHost.includes("instagram.com")) return "instagram";
  if (refHost.includes("tiktok.com")) return "tiktok";
  if (refHost.includes("pinterest.com")) return "pinterest";
  if (refHost.includes("google.com") || refHost.includes("google.co")) return "google";
  if (refHost.includes("facebook.com") || refHost.includes("fb.com") || refHost === "m.facebook.com") return "facebook";
  if (refHost === "t.co" || refHost.includes("twitter.com") || refHost.includes("x.com")) return "twitter";
  if (refHost.includes("weixin") || refHost.includes("wechat")) return "wechat";

  // Treat internal navigation (same site) as direct
  if (refHost === window.location.hostname) return "direct";

  return "referral";
}

export interface TrackEventOptions {
  event_name: string;
  product_id?: string;
  tool_name?: string;
}

// Queue for batching non-critical events — flush every 2s or when queue reaches 10.
let queue: object[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, 2000);
}

async function flush() {
  flushTimer = null;
  if (!queue.length) return;
  const batch = queue.splice(0);
  try {
    const res = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
      keepalive: true,
    });
    if (!res.ok) {
      console.error("[analytics] flush failed:", res.status, await res.text().catch(() => ""));
      queue.unshift(...batch);
    }
  } catch (err) {
    console.error("[analytics] flush error:", err);
    queue.unshift(...batch);
  }
}

async function flushImmediate(events: object[]) {
  try {
    const res = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
      keepalive: true,
    });
    if (!res.ok) {
      console.error("[analytics] immediate flush failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[analytics] immediate flush error:", err);
  }
}

export function track(opts: TrackEventOptions) {
  if (typeof window === "undefined") return;
  // Drop events from localhost and non-production Vercel preview URLs
  if (!isProductionHost()) return;

  const event = {
    event_name: opts.event_name,
    page_url: window.location.href,
    product_id: opts.product_id ?? null,
    tool_name: opts.tool_name ?? null,
    anonymous_user_id: getAnonId(),
    session_id: getSessionId(),
    device_type: getDeviceType(),
    browser: getBrowser(),
    traffic_source: getTrafficSource(),
    referrer: document.referrer || null,
    // country + region resolved server-side from Vercel geo headers
    country: null,
    region: null,
  };

  if (IMMEDIATE_EVENTS.has(opts.event_name)) {
    flushImmediate([event]);
    return;
  }

  queue.push(event);

  if (queue.length >= 10) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    flush();
  } else {
    scheduleFlush();
  }
}

// Flush on page unload
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}
