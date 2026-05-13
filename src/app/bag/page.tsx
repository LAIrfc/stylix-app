import { Suspense } from "react";
import { BagClient } from "./BagClient";

export const metadata = { title: "Your Bag — Stylix" };

export default function BagPage() {
  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      <div className="border-b border-ivory/10 py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-gold/40" />
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">
              Stylix · Your Selection
            </p>
          </div>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Your Bag</h1>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/30 animate-pulse">
              Loading…
            </p>
          </div>
        }
      >
        <BagClient />
      </Suspense>
    </div>
  );
}
