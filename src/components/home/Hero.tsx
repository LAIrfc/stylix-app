"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";

export function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        el.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-[100svh] overflow-hidden bg-[#0a0a09]">
      {/* Model image — right-weighted, fills the frame */}
      <div
        ref={imgRef}
        className="absolute will-change-transform"
        style={{ inset: "-10% 0" }}
      >
        <Image
          src="/hero-editorial.jpg"
          alt="Stylix"
          fill
          className="object-cover object-[62%_center]"
          priority
          sizes="100vw"
        />
        {/* Left vignette to carve out editorial copy space */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a09] via-[#0a0a09]/60 to-transparent" />
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a09] to-transparent"
        aria-hidden
      />

      {/* Editorial copy — left column */}
      <div className="absolute inset-0 flex items-end pb-20 lg:items-center lg:pb-0">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-28">
          <div className="max-w-[520px]">
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">
              Stylix
            </p>

            <h1 className="mt-8 font-serif text-[2.75rem] leading-[1.1] text-ivory sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]">
              Your Private
              <br />
              AI Atelier
            </h1>

            <p className="mt-7 max-w-[380px] text-[0.9375rem] leading-[1.75] text-ivory/55">
              Curated jewelry for identity, mood, and occasion —
              selected through a considered aesthetic lens.
            </p>

            <div className="mt-12">
              <ButtonLink
                href="/collection"
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory hover:text-ink hover:border-ivory"
              >
                Explore Collection
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
