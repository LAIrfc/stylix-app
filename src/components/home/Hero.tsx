"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
        el.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="relative h-[100svh] overflow-hidden bg-[#0a0a09]">
      <div ref={imgRef} className="absolute will-change-transform" style={{ inset: "-10% 0" }}>
        <Image
          src="/hero-editorial.jpg"
          alt="Stylix"
          fill
          className="object-cover object-[38%_center]"
          priority
          sizes="100vw"
        />
      </div>
      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a09] to-transparent" aria-hidden />
    </section>
  );
}
