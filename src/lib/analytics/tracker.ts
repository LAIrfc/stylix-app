// Analytics tracker — fires events to /api/analytics
// All IDs are anonymous and stored in sessionStorage/localStorage.

const ANON_ID_KEY = "stylix_anon_id";
const SESSION_ID_KEY = "stylix_session_id";

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

export interface TrackEventOptions {
  event_name: string;
  product_id?: string;
  tool_name?: string;
}

// Queue for batching — flush every 2s or when queue reaches 10
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
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
      keepalive: true,
    });
  } catch {
    // Silently fail — analytics must never break the app
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
    referrer: document.referrer || null,
    country: null, // resolved server-side if needed
  };

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
