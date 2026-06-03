import { Suspense } from "react";
import { AdminAnalyticsDashboard } from "./AdminAnalyticsDashboard";

export const metadata = { title: "Analytics — Stylix Admin" };

export default function AdminAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink-deep">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold/40 animate-pulse">
            Loading analytics…
          </p>
        </div>
      }
    >
      <AdminAnalyticsDashboard />
    </Suspense>
  );
}
