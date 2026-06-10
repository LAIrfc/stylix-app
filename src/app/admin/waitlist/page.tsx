import { Suspense } from "react";
import { AdminWaitlistClient } from "./AdminWaitlistClient";

export const metadata = { title: "Early Access Waitlist — Stylix Admin" };

export default function AdminWaitlistPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink-deep">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold/40 animate-pulse">
            Loading waitlist…
          </p>
        </div>
      }
    >
      <AdminWaitlistClient />
    </Suspense>
  );
}
