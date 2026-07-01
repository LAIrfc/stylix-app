"use client";

import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/ui/SectionHeading";

function IconAiStylist({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 8l2.2 6.8h7.1l-5.7 4.1 2.2 6.8L24 21.6l-5.8 4.1 2.2-6.8-5.7-4.1h7.1L24 8z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 30c2.5 3.5 6.4 5.5 10 5.5s7.5-2 10-5.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M18 34h12M21 38h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconArTryOn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect
        x="10"
        y="14"
        width="28"
        height="22"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="24" cy="25" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 10h4M28 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconSmartMatch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="16" cy="24" r="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="32" cy="16" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M19.5 22.5l9-4M19.5 25.5l9 4M28.5 18.5l1.5 2M28.5 29.5l1.5-2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CoreServices() {
  const { t } = useI18n();

  const cards = [
    { key: "aiStylist", title: t.services.aiStylist.title, desc: t.services.aiStylist.desc, Icon: IconAiStylist },
    { key: "arTryOn", title: t.services.arTryOn.title, desc: t.services.arTryOn.desc, Icon: IconArTryOn },
    { key: "smartMatch", title: t.services.smartMatch.title, desc: t.services.smartMatch.desc, Icon: IconSmartMatch },
  ] as const;

  return (
    <section className="bg-ivory-warm py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} theme="light" />
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-12">
          {cards.map(({ key, title, desc, Icon }) => (
            <article
              key={key}
              className="group relative flex flex-col bg-ivory p-10 transition-all duration-500 lg:p-12 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center text-gold-muted transition-colors duration-500 group-hover:text-gold">
                <Icon className="h-9 w-9" />
              </div>
              <h3 className="font-serif text-[1.625rem] leading-[1.2] text-ink md:text-[1.75rem]">{title}</h3>
              <p className="mt-6 flex-1 text-[0.9375rem] leading-[1.75] text-ink/65">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
