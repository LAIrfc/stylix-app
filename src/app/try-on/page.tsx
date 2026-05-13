import { Suspense } from "react";
import Link from "next/link";
import { TryOnClient } from "./TryOnClient";

export default function TryOnPage() {
  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="border-b border-ivory/10 py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-gold/40" />
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">
              Stylix · Private Fitting Atelier
            </p>
          </div>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">
            Virtual Try-On
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory-dim/80">
            Your private AI jewelry fitting room. Upload a photo or open live camera — then select
            a piece and let Stylix compose it against your silhouette.
          </p>

          {/* Luxury microcopy strip */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-ivory/8 pt-6">
            {[
              "Selected for your silhouette",
              "Balanced for your neckline",
              "Curated for your mood",
              "Matched to your celestial profile",
            ].map((line) => (
              <span key={line} className="text-[10px] uppercase tracking-[0.3em] text-ivory/25">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Try-on tool ──────────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/30 animate-pulse">
              Preparing your atelier…
            </p>
          </div>
        }
      >
        <TryOnClient />
      </Suspense>

      {/* ── Private Atelier CTA ──────────────────────────────────────────── */}
      <div className="border-t border-ivory/8 bg-ink-soft/30 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-gold/60 mb-3">
                Private Atelier
              </p>
              <p className="font-serif text-xl text-ivory">
                Want a bespoke fitting session?
              </p>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ivory-dim/70">
                Private Atelier clients receive one-on-one symbolic styling sessions, early access
                to new pieces, and bespoke material selection guided by Stylix AI.
              </p>
            </div>
            <Link
              href="/vip"
              className="shrink-0 border border-gold/30 px-8 py-3.5 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:border-gold hover:text-gold-light"
            >
              Apply for Private Atelier →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
