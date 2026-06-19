// Analytics tracker — fires events to /api/analytics
// All IDs are anonymous and stored in sessionStorage/localStorage.

const ANON_ID_KEY = "stylix_anon_id";
const SESSION_ID_KEY = "stylix_session_id";

// Commerce events that must flush immediately, not wait for the 2s batch timer.
const IMMEDIATE_EVENTS = new Set([
  "product_view",
  "add_to_cart",
  "cart_view",
  "checkout_start",
  "checkout_submit",
  "purchase",
]);

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
  if (/chrome|chromium|crios/i.test(ua)) return "chrome";
  if (/firefox|fxios/i.test(ua)) return "firefox";
  if (/safari/i.test(ua)) return "safari";
  return "other";
}

function getTrafficSource(): string {
  if (typeof window === "undefined") return "direct";
  // Check UTM source param first
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";
  if (utmSource) {
    if (utmSource.includes("instagram")) return "instagram";
    if (utmSource.includes("tiktok")) return "tiktok";
    if (utmSource.includes("pinterest")) return "pinterest";
    if (utmSource.includes("google")) return "google";
    if (utmSource.includes("facebook") || utmSource.includes("fb")) return "facebook";
    return "referral";
  }
  // Fall back to referrer
  const ref = document.referrer?.toLowerCase() ?? "";
  if (!ref) return "direct";
  if (ref.includes("instagram.com")) return "instagram";
  if (ref.includes("tiktok.com")) return "tiktok";
  if (ref.includes("pinterest.com")) return "pinterest";
  if (ref.includes("google.com") || ref.includes("google.co")) return "google";
  if (ref.includes("facebook.com") || ref.includes("fb.com")) return "facebook";
  return "referral";
}

export interface TrackEventOptions {
  event_name: string;
  product_id?: string;
  tool_name?: string;
  browser?: string;
  traffic_source?: string;
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
      // Re-queue so events aren't silently lost
      queue.unshift(...batch);
    }
  } catch (err) {
    console.error("[analytics] flush error:", err);
    // Re-queue so events aren't silently lost
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
    country: null,
  };

  if (IMMEDIATE_EVENTS.has(opts.event_name)) {
    // Fire immediately — don't batch commerce events
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
