"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/lib/i18n/context";

export function VipTeaser() {
  const { t } = useI18n();
  const v = t.vipTeaser;

  return (
    <section className="relative bg-ink-deep py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(212,196,168,0.04),transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading eyebrow={v.eyebrow} title={v.title} theme="dark" />
        <div className="mt-20 grid gap-10 md:grid-cols-3 lg:mt-24 lg:gap-12">
          {v.services.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col bg-ink-soft/50 border border-ivory/8 p-12 transition-all duration-500 hover:border-gold-champagne/25 lg:p-14"
            >
              <div className="h-px w-12 bg-gold-champagne/40 transition-all duration-500 group-hover:w-16" />
              <h3 className="mt-10 font-serif text-[1.625rem] leading-[1.25] text-ivory lg:text-[1.75rem]">{s.title}</h3>
              <p className="mt-7 flex-1 text-[0.9375rem] leading-[1.75] text-ivory-dim/80">{s.text}</p>
              <Link
                href="/vip"
                className="mt-14 inline-flex text-[10px] uppercase tracking-[0.35em] text-gold-champagne transition-colors hover:text-gold-light"
              >
                {v.inquire}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
