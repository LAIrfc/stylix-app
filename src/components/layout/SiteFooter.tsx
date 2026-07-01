"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export function SiteFooter() {
  const { t } = useI18n();
  const f = t.footer;

  const social = [
    { href: "#", label: f.social.instagram },
    { href: "#", label: f.social.pinterest },
    { href: "#", label: f.social.linkedin },
  ];

  const collections = [
    { href: "/collection", label: f.allPieces },
    { href: "/collection?tab=designer-capsule", label: f.hearthHalo },
    { href: "/collection?tab=celestial-essentials", label: f.celestialGuardians },
  ];

  const services = [
    { href: "/advisor", label: f.aiStylist },
    { href: "/try-on", label: f.virtualTryOn },
    { href: "/vip", label: f.bespokeVip },
  ];

  return (
    <footer className="border-t border-ivory/10 bg-ink-soft/80">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="font-serif text-2xl tracking-[0.08em] text-ivory">Stylix</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory-dim">
              {f.tagline}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {social.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-xs uppercase tracking-[0.2em] text-ivory-dim transition-colors hover:text-gold"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{f.collectionsLabel}</p>
            <ul className="mt-5 space-y-2.5">
              {collections.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-ivory-soft transition-colors hover:text-gold">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{f.servicesLabel}</p>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-ivory-soft transition-colors hover:text-gold">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{f.contactLabel}</p>
            <p className="mt-5 text-sm text-ivory-soft">
              {f.concierge}{" "}
              <a href="mailto:zilailayimamuniyazi@gmail.com" className="transition-colors hover:text-gold">
                zilailayimamuniyazi@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-ivory-dim">{f.cities}</p>
            <ul className="mt-8 flex flex-wrap gap-6 text-xs text-ivory-dim">
              <li>
                <Link href="#" className="hover:text-gold">
                  {f.privacy}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold">
                  {f.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-14 border-t border-ivory/10 pt-10 text-center text-xs text-ivory-dim/80">
          © {new Date().getFullYear()} Stylix. {f.allRights}
        </p>
      </div>
    </footer>
  );
}
