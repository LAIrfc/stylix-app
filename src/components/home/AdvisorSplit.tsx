"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/lib/i18n/context";

export function AdvisorSplit() {
  const { t } = useI18n();
  const a = t.advisorSplit;

  return (
    <section className="bg-pearl-gray py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          align="center"
          eyebrow={a.eyebrow}
          title={a.title}
          theme="light"
        />
        <p className="mx-auto mt-6 max-w-2xl text-center text-[0.9375rem] leading-[1.7] text-ink/60 md:text-base">
          {a.subtitle}
        </p>

        <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-2 lg:gap-14">
          {/* Mock conversation */}
          <div className="flex flex-col bg-ivory-soft border border-pearl-gray p-10 sm:p-12">
            <div className="flex items-center justify-between border-b border-ink/10 pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold-muted">Stylix stylist</p>
                <p className="mt-1 font-serif text-[1.125rem] text-ink">Session</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-gold-champagne shadow-[0_0_8px_rgba(212,196,168,0.5)]" />
            </div>
            <div className="mt-7 flex flex-1 flex-col gap-5">
              <div className="ml-auto max-w-[90%] bg-ivory border border-pearl-gray px-6 py-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-ink/40">{a.youLabel}</p>
                <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink/80">
                  {a.userMessage}
                </p>
              </div>
              <div className="max-w-[92%] border border-gold-champagne/40 bg-gold-champagne/8 px-6 py-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold-deep">Stylix</p>
                <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink/75">
                  {a.stylixReply}
                </p>
              </div>
            </div>
            <div className="mt-9 flex gap-3 border-t border-ink/10 pt-7">
              <div className="h-11 flex-1 border border-pearl-gray bg-ivory" />
              <div className="h-11 w-24 border border-gold-champagne/40 bg-gold-champagne/8" />
            </div>
            <div className="mt-8">
              <ButtonLink href="/advisor" className="w-full justify-center sm:w-auto">
                {a.openAdvisor}
              </ButtonLink>
            </div>
          </div>

          {/* Virtual try-on preview card */}
          <div className="relative flex min-h-[400px] flex-col justify-end overflow-hidden bg-ink-deep lg:min-h-[440px]">
            <Image
              src="/ai-stylist-gemini-dark.jpg"
              alt="AI Luxury Styling Session"
              fill
              className="object-cover object-top"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-transparent to-transparent" />
            <div className="relative p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold-champagne">{a.arExperience}</p>
              <p className="mt-3 font-serif text-[1.75rem] leading-[1.2] text-ivory">{a.seeOnYou}</p>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-[1.65] text-ivory/85">
                {a.arDesc}
              </p>
              <div className="mt-7">
                <ButtonLink href="/try-on" variant="outline">
                  {a.launchTryOn}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
