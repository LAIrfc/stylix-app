"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

export function Personalization() {
  const { t } = useI18n();

  return (
    <section className="border-t border-ivory/10 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <SectionHeading
          align="center"
          eyebrow={t.home.personalization.eyebrow}
          title={t.home.personalization.title}
        />
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-ivory-dim">
          {t.home.personalization.body}
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/vip" variant="outline">
            {t.home.personalization.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
