"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

const services = [
  { label: "AI Luxury Styling", href: "/advisor" },
  { label: "Virtual Try-On", href: "/try-on" },
  { label: "Designer Capsules", href: "/collection?tab=designer-capsule" },
  { label: "Private Atelier", href: "/vip" },
];

export function Hero() {
  const [heroImageSrc, setHeroImageSrc] = useState("/hero-ai-stylist.png");
  const { t } = useI18n();

  return (
    <section className="relative min-h-[min(100svh,960px)] overflow-hidden bg-ink-deep pt-16">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-5%,rgba(201,169,98,0.05),transparent_65%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-[1fr_1fr] lg:px-12 min-h-[min(calc(100svh-4rem),896px)]">

        {/* ── Left: copy ──────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center py-20 lg:py-32 lg:pr-16">

          {/* Platform label */}
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-8 bg-gold/40" />
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">
              AI Luxury Styling Platform
            </p>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[2.5rem] leading-[1.06] tracking-tight text-ivory text-balance sm:text-[3.25rem] sm:leading-[1.05] lg:text-[4rem] lg:leading-[1.04] xl:text-[4.5rem]">
            Your private<br />
            <em className="not-italic text-gold-champagne">AI atelier</em><br />
            for jewelry.
          </h1>

          {/* Subline */}
          <p className="mt-8 max-w-md text-[1rem] leading-[1.7] text-ivory-dim/80 sm:text-[1.0625rem] sm:leading-[1.75]">
            Curated designer capsules and identity-based jewelry curation — selected through the Stylix aesthetic lens for your occasion, mood, and energy.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <ButtonLink href="/advisor" className="w-full justify-center sm:w-auto">
              Start AI Styling
            </ButtonLink>
            <ButtonLink href="/collection" variant="outline" className="w-full justify-center sm:w-auto">
              Explore Collection
            </ButtonLink>
          </div>

          {/* Service nav strip */}
          <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ivory/8 pt-8">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="text-[10px] uppercase tracking-[0.3em] text-ivory/35 transition-colors hover:text-gold"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Right: image ─────────────────────────────────────────────── */}
        <div className="relative hidden lg:flex lg:items-stretch">
          <div className="relative w-full overflow-hidden">
            <Image
              src={heroImageSrc}
              alt="Stylix — AI luxury jewelry styling"
              fill
              className="object-cover object-center"
              priority
              sizes="50vw"
              onError={() => setHeroImageSrc("/hero-jewelry.svg")}
            />
            {/* Bottom fade into page */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/50 via-transparent to-transparent" />

            {/* Floating editorial card */}
            <div className="absolute bottom-10 left-8 right-8 border border-ivory/12 bg-ink-deep/80 backdrop-blur-sm px-7 py-5">
              <p className="text-[9px] uppercase tracking-[0.45em] text-gold/60 mb-2">
                Stylix · Curated for you
              </p>
              <p className="font-serif text-base text-ivory leading-snug">
                &ldquo;Selected for your silhouette and celestial profile.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Mobile image strip */}
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:hidden">
          <Image
            src={heroImageSrc}
            alt="Stylix — AI luxury jewelry styling"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
            onError={() => setHeroImageSrc("/hero-jewelry.svg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/70 via-transparent to-transparent" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ivory-warm to-transparent" aria-hidden />
    </section>
  );
}
