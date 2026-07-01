"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export function HowStylixUnderstands() {
  const { t } = useI18n();
  const intel = t.home.intelligence;
  const pillars = intel.pillars.map((p, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: p.title,
    body: p.body,
  }));

  return (
    <section className="bg-ink-deep py-28 lg:py-36 border-t border-ivory/8">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr] lg:items-start">
          {/* Left label column */}
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">{intel.eyebrow}</p>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-ivory lg:text-4xl">
              {intel.title}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-ivory-dim/80 max-w-xs">
              {intel.subtitle}
            </p>
            <Link
              href="/advisor"
              className="mt-10 inline-flex text-[10px] uppercase tracking-[0.35em] text-gold transition-colors hover:text-gold-light"
            >
              {intel.cta}
            </Link>
          </div>

          {/* Right pillars grid */}
          <div className="grid gap-px bg-ivory/8 border border-ivory/8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.number}
                className="group bg-ink-deep p-8 transition-colors duration-500 hover:bg-ink-soft/60 lg:p-10"
              >
                <p className="font-mono text-[10px] text-gold/30">{p.number}</p>
                <h3 className="mt-4 font-serif text-lg leading-snug text-ivory">{p.title}</h3>
                <div className="my-5 h-px w-8 bg-gold/20 transition-all duration-500 group-hover:w-12" />
                <p className="text-sm leading-relaxed text-ivory-dim/75">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
