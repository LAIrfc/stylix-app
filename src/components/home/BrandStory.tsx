"use client";

import { useI18n } from "@/lib/i18n/context";

export function BrandStory() {
  const { t } = useI18n();

  return (
    <section className="bg-ivory-warm py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold-muted">{t.brand.eyebrow}</p>
        <div className="mt-16 grid gap-20 lg:mt-20 lg:grid-cols-2 lg:gap-28 lg:items-start">
          <div>
            <p className="font-serif text-[2rem] leading-[1.25] text-ink md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.2]">
              {t.brand.headline}
            </p>
          </div>
          <div className="pl-0 lg:pl-0">
            <p className="text-[1rem] leading-[1.75] text-ink/60 md:text-[1.0625rem] md:leading-[1.8]">
              {t.brand.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
