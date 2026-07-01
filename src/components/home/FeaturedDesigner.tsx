"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export function FeaturedDesigner() {
  const { t } = useI18n();
  const fd = t.home.featuredDesigner;

  return (
    <section className="border-t border-ivory/8 bg-ink-deep py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16 lg:items-center">
          {/* Left: Stylix curation framing */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/60">{fd.eyebrow}</p>
            <h2 className="mt-5 font-serif text-2xl text-ivory lg:text-3xl">{fd.name}</h2>
            <div className="my-5 h-px w-8 bg-gold/20" />
            <p className="text-sm leading-relaxed text-ivory-dim/80 max-w-sm">{fd.desc}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-gold/40">{fd.note}</p>
            <Link
              href="/collection?tab=designer-capsule"
              className="mt-8 inline-flex border border-gold/30 px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:border-gold hover:text-gold-light"
            >
              {fd.cta}
            </Link>
          </div>

          {/* Right: editorial quote */}
          <div className="border border-ivory/8 bg-ink-soft/30 px-10 py-10 lg:px-14 lg:py-12">
            <p className="font-serif text-lg leading-relaxed text-ivory/60 italic lg:text-xl">
              &ldquo;{fd.quote}&rdquo;
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-gold/50">
              {fd.attribution}
            </p>
            <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-ivory/40">
              {fd.capsuleLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
