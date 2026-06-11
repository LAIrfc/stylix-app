"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";

/* Zodiac glyph paths — 12 signs, minimal stroke */
const ZODIAC_GLYPHS = [
  "M12,4 C12,4 8,8 8,12 C8,16 12,18 12,18 C12,18 16,16 16,12 C16,8 12,4 12,4Z M10,10 L14,14 M14,10 L10,14",
  "M8,6 C8,6 6,10 8,13 C10,16 14,16 16,13 C18,10 16,6 16,6 M8,6 L16,6",
  "M7,12 L17,12 M10,7 L10,17 M14,7 L14,17",
  "M8,8 C8,8 6,12 8,15 C10,18 12,16 12,16 C12,16 14,18 16,15 C18,12 16,8 16,8",
  "M12,5 L14,9 L18,9 L15,12 L16,16 L12,14 L8,16 L9,12 L6,9 L10,9Z",
  "M8,12 C8,9 10,7 12,7 C14,7 16,9 16,12 M12,12 L12,17 M9,17 L15,17",
  "M7,11 L17,11 M7,13 L17,13",
  "M12,5 L12,19 M8,8 C8,8 12,11 16,8 M8,16 C8,16 12,13 16,16",
  "M8,7 L16,7 L12,12 L16,17 L8,17",
  "M8,7 L8,17 L12,12 L16,17 L16,7 M10,7 C10,5 14,5 14,7",
  "M8,12 C8,9 10,7 12,7 C14,7 16,9 16,12 C16,15 14,17 12,17 C10,17 8,15 8,12Z M12,7 L12,4 M12,17 L12,20",
  "M7,10 C7,10 9,8 12,10 C15,12 17,10 17,10 M7,14 C7,14 9,12 12,14 C15,16 17,14 17,14",
];

const STAR_POSITIONS = [
  [15, 22], [72, 18], [88, 35], [60, 10], [35, 8],
  [92, 58], [5, 50], [80, 72], [25, 78], [55, 88],
  [10, 88], [45, 95], [95, 90], [70, 48], [18, 62],
  [48, 40], [82, 25], [30, 45], [65, 65], [42, 72],
];

const CONSTELLATION_LINES = [
  [0, 4], [4, 3], [3, 1], [1, 16], [16, 6],
  [2, 7], [7, 9], [9, 11], [11, 13],
  [5, 14], [14, 18], [18, 8],
];

function CelestialOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 480, height: 480 }}>
      {/* Outer ambient glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 480,
          height: 480,
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,169,98,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Star field */}
      <svg
        viewBox="0 0 100 100"
        className="absolute"
        style={{ width: 480, height: 480, animation: "orb-rotate 80s linear infinite" }}
        aria-hidden
      >
        {STAR_POSITIONS.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 4 === 0 ? 0.55 : 0.3}
            fill="rgba(201,169,98,0.6)"
          />
        ))}
        {CONSTELLATION_LINES.map(([a, b], i) => (
          <line
            key={i}
            x1={STAR_POSITIONS[a][0]}
            y1={STAR_POSITIONS[a][1]}
            x2={STAR_POSITIONS[b][0]}
            y2={STAR_POSITIONS[b][1]}
            stroke="rgba(201,169,98,0.12)"
            strokeWidth="0.3"
          />
        ))}
      </svg>

      {/* Main sphere */}
      <div
        className="relative rounded-full border"
        style={{
          width: 320,
          height: 320,
          borderColor: "rgba(201,169,98,0.18)",
          background:
            "radial-gradient(ellipse 65% 75% at 38% 35%, rgba(201,169,98,0.09) 0%, rgba(10,10,9,0.85) 55%, rgba(5,5,5,0.95) 100%)",
          boxShadow:
            "inset 0 0 60px rgba(201,169,98,0.04), 0 0 80px rgba(201,169,98,0.06), 0 0 1px rgba(201,169,98,0.2)",
        }}
      >
        {/* Zodiac ring — slow rotation */}
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0"
          style={{ animation: "orb-rotate 45s linear infinite" }}
          aria-hidden
        >
          <circle
            cx="160"
            cy="160"
            r="148"
            fill="none"
            stroke="rgba(201,169,98,0.1)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
          {ZODIAC_GLYPHS.map((_, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const r = 148;
            const x = 160 + r * Math.cos(angle);
            const y = 160 + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.8"
                fill="rgba(201,169,98,0.35)"
              />
            );
          })}
        </svg>

        {/* Inner orbit ring — counter-rotation */}
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0"
          style={{ animation: "orb-rotate-reverse 30s linear infinite" }}
          aria-hidden
        >
          <ellipse
            cx="160"
            cy="160"
            rx="100"
            ry="38"
            fill="none"
            stroke="rgba(201,169,98,0.14)"
            strokeWidth="0.5"
            transform="rotate(-20 160 160)"
          />
          <circle cx="260" cy="160" r="2.5" fill="rgba(201,169,98,0.4)" transform="rotate(-20 160 160)" />
        </svg>

        {/* Second orbit — tilted */}
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0"
          style={{ animation: "orb-rotate 55s linear infinite" }}
          aria-hidden
        >
          <ellipse
            cx="160"
            cy="160"
            rx="88"
            ry="30"
            fill="none"
            stroke="rgba(212,196,168,0.08)"
            strokeWidth="0.5"
            transform="rotate(40 160 160)"
          />
          <circle cx="248" cy="160" r="2" fill="rgba(212,196,168,0.3)" transform="rotate(40 160 160)" />
        </svg>

        {/* Center wordmark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p
            className="font-serif text-[1.1rem] tracking-[0.3em] text-gold/50"
            style={{ letterSpacing: "0.35em" }}
          >
            STYLIX
          </p>
          <div
            className="mt-3 h-px w-8"
            style={{ background: "rgba(201,169,98,0.25)" }}
          />
          <p className="mt-3 text-[8px] uppercase tracking-[0.45em] text-gold/25">
            Atelier
          </p>
        </div>
      </div>

      {/* Floating zodiac glyphs — scattered around sphere */}
      <svg
        viewBox="0 0 480 480"
        className="pointer-events-none absolute inset-0"
        style={{ animation: "orb-rotate-reverse 60s linear infinite" }}
        aria-hidden
      >
        {[0, 2, 5, 8, 10].map((idx) => {
          const angle = (idx / 12) * Math.PI * 2 - Math.PI / 2;
          const r = 215;
          const cx = 240 + r * Math.cos(angle);
          const cy = 240 + r * Math.sin(angle);
          return (
            <g key={idx} transform={`translate(${cx - 12}, ${cy - 12})`} opacity="0.25">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d={ZODIAC_GLYPHS[idx]}
                  fill="none"
                  stroke="rgba(201,169,98,0.9)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

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
    <>
      <style>{`
        @keyframes orb-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orb-rotate-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>

      <section className="relative h-[100svh] overflow-hidden bg-[#0a0a09]">
        {/* Model image — parallax, right half only on large screens */}
        <div
          ref={imgRef}
          className="absolute will-change-transform"
          style={{ inset: "-10% 0" }}
        >
          <Image
            src="/hero-editorial.jpg"
            alt="Stylix editorial"
            fill
            className="object-cover object-[62%_center]"
            priority
            sizes="100vw"
          />
          {/* Dark left mask for copy legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a09] via-[#0a0a09]/75 to-[#0a0a09]/10 lg:via-[#0a0a09]/65 lg:to-transparent" />
          {/* On desktop: hide model on left half to isolate orb */}
          <div className="absolute inset-y-0 left-0 hidden w-[50%] bg-[#0a0a09] lg:block" />
        </div>

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a09] to-transparent"
          aria-hidden
        />

        {/* Two-column layout on large screens */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-8 sm:px-12 lg:px-0">
            <div className="mx-auto flex max-w-7xl items-center gap-0 lg:px-20 xl:px-28">

              {/* Left — editorial copy */}
              <div className="w-full lg:w-[45%] lg:pr-16 xl:pr-20">
                <p className="text-[10px] uppercase tracking-[0.55em] text-gold/60">
                  Stylix
                </p>
                <h1 className="mt-7 font-serif text-[2.75rem] leading-[1.08] text-ivory sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.75rem]">
                  Your Private
                  <br />
                  AI Atelier
                </h1>
                <p className="mt-7 max-w-[360px] text-[0.9375rem] leading-[1.8] text-ivory/50">
                  Curated jewelry for identity, mood, and occasion —
                  selected through a considered aesthetic lens.
                </p>
                <div className="mt-12">
                  <ButtonLink
                    href="/collection"
                    variant="outline"
                    className="border-ivory/25 text-ivory hover:bg-ivory hover:text-ink hover:border-ivory"
                  >
                    Explore Collection
                  </ButtonLink>
                </div>
              </div>

              {/* Right — celestial orb (desktop only) */}
              <div className="hidden lg:flex lg:w-[55%] lg:items-center lg:justify-center">
                <CelestialOrb />
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
