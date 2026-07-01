"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "@/lib/cart/CartContext";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const tryOnTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useI18n();
  const { itemCount } = useCart();

  const tryOnItems = [
    { href: "/try-on", label: t.nav.arTryOn },
    { href: "/identity-portrait", label: t.nav.identityPortrait },
  ];

  const nav = [
    { href: "/collection", label: t.nav.collection },
    { href: "/advisor", label: t.nav.advisor },
    { href: "/collection?tab=designer-capsule", label: t.nav.designerCapsule },
    { href: "/vip", label: t.nav.vip },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ivory/10 bg-ink-deep/92 backdrop-blur-md" style={{ overflow: "visible" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="font-serif text-lg tracking-[0.12em] text-ivory transition-colors hover:text-gold-light sm:text-xl"
        >
          Stylix
        </Link>
        <nav className="hidden items-center gap-8 lg:gap-10 md:flex">
          {nav.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold whitespace-nowrap ${
                pathname === item.href ? "text-gold" : "text-ivory-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Try-On dropdown */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => {
              if (tryOnTimeout.current) clearTimeout(tryOnTimeout.current);
              setTryOnOpen(true);
            }}
            onMouseLeave={() => {
              tryOnTimeout.current = setTimeout(() => setTryOnOpen(false), 150);
            }}
          >
            <button
              type="button"
              className={`text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold whitespace-nowrap ${
                pathname === "/try-on" || pathname === "/identity-portrait"
                  ? "text-gold"
                  : "text-ivory-dim"
              }`}
            >
              {t.nav.tryOn}
            </button>
            {tryOnOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50">
                <div className="border border-ivory/10 bg-ink-deep/95 backdrop-blur-xl rounded-lg py-2 min-w-[180px] shadow-luxury">
                  {tryOnItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setTryOnOpen(false)}
                      className={`block px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-center transition-colors hover:text-gold hover:bg-gold/5 ${
                        pathname === item.href ? "text-gold" : "text-ivory-dim"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nav.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold whitespace-nowrap ${
                pathname === item.href ? "text-gold" : "text-ivory-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link
            href="/bag"
            aria-label="View bag"
            className="relative flex h-8 w-8 items-center justify-center text-ivory-dim transition-colors hover:text-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-ink-deep">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/bag"
            aria-label="View bag"
            className="relative flex h-8 w-8 items-center justify-center text-ivory-dim"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-ink-deep">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="h-px w-5 bg-ivory" />
            <span className="h-px w-5 bg-ivory" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-ivory/10 bg-ink-deep px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-ivory-soft"
              >
                {item.label}
              </Link>
            ))}
            <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/30 mt-2">
              {t.nav.tryOn}
            </p>
            {tryOnItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-ivory-soft pl-4"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/bag"
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest text-ivory-soft"
            >
              {t.nav.bag} {itemCount > 0 && `(${itemCount})`}
            </Link>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
