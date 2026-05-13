"use client";

import { useI18n } from "@/lib/i18n/context";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function StayUpdated() {
  const { t } = useI18n();
  const s = t.stayUpdated;

  return (
    <section className="bg-ivory-warm py-28 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold-muted">{s.eyebrow}</p>
        <h2 className="mt-6 font-serif text-[2rem] leading-[1.2] text-ink md:text-[2.5rem]">{s.title}</h2>
        <p className="mx-auto mt-7 max-w-lg text-[0.9375rem] leading-[1.75] text-ink/60 md:text-base">
          {s.subtitle}
        </p>
        <div className="mt-12">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
