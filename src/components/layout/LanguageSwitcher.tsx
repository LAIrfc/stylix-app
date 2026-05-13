"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT_LABELS } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/types";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(l: Locale) {
    setLocale(l);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-ivory-dim transition-colors hover:text-gold"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{LOCALE_SHORT_LABELS[locale]}</span>
        <svg
          className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 min-w-[9rem] rounded border border-ivory/10 bg-ink-deep py-1 shadow-xl"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              type="button"
              onClick={() => select(l)}
              className={`w-full px-4 py-2 text-left text-[11px] tracking-[0.18em] transition-colors hover:bg-ivory/5 hover:text-gold ${
                l === locale ? "text-gold" : "text-ivory-dim"
              }`}
            >
              <span className="mr-2 font-mono opacity-50">{LOCALE_SHORT_LABELS[l]}</span>
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
