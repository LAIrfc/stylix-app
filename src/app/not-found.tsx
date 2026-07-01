"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">{t.errors.notFoundCode}</p>
      <h1 className="mt-6 font-serif text-3xl text-ivory md:text-4xl">{t.errors.notFoundTitle}</h1>
      <p className="mt-4 max-w-md text-sm text-ivory-dim">
        {t.errors.notFoundBody}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/collection">{t.errors.collection}</ButtonLink>
        <ButtonLink href="/" variant="outline">
          {t.errors.home}
        </ButtonLink>
      </div>
      <Link href="/advisor" className="mt-8 text-xs uppercase tracking-widest text-ivory-dim hover:text-gold">
        {t.errors.aiAdvisor}
      </Link>
    </div>
  );
}
