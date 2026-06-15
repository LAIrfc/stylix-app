"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const PANELS = [
  {
    label: "AI Stylist",
    sub: "Identity-based curation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M12 3l1.8 5.5H19l-4.6 3.3 1.8 5.5L12 14l-4.2 3.3 1.8-5.5L5 8.5h5.2L12 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    delay: "0s",
    position: "top-[18%] left-[5%] lg:top-[22%] lg:left-[6%]",
    floatClass: "animate-float-a",
  },
  {
    label: "Digital Atelier",
    sub: "Private styling sessions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <rect x="3" y="6" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 6V4.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 11v4M10 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    delay: "0.6s",
    position: "top-[14%] right-[5%] lg:top-[18%] lg:right-[7%]",
    floatClass: "animate-float-b",
  },
  {
    label: "3D Try-On",
    sub: "Preview before you commit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M12 3L21 8.5V15.5L12 21L3 15.5V8.5L12 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 3v18M3 8.5l9 5.5 9-5.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    delay: "1.2s",
    position: "bottom-[22%] left-[5%] lg:bottom-[26%] lg:left-[6%]",
    floatClass: "animate-float-c",
  },
  {
    label: "Discover Jewelry",
    sub: "Curated designer capsules",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    delay: "1.8s",
    position: "bottom-[18%] right-[5%] lg:bottom-[22%] lg:right-[7%]",
    floatClass: "animate-float-a",
  },
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        @keyframes float-a {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes float-c {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .animate-float-a { animation: float-a 6s ease-in-out infinite; }
        .animate-float-b { animation: float-b 7s ease-in-out infinite; }
        .animate-float-c { animation: float-c 8s ease-in-out infinite; }

        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-up { animation: hero-fade-up 1s ease-out forwards; opacity: 0; }

        @keyframes panel-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .panel-in { animation: panel-in 0.8s ease-out forwards; opacity: 0; }
      `}</style>

      <section className="relative h-[100svh] w-full overflow-hidden bg-black">

        {/* Video background */}
        <video
          ref={videoRef}
          src="/hero-video.mp4.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />

        {/* Dark overlay 50% */}
        <div className="absolute inset-0 bg-black/50" aria-hidden />

        {/* Subtle radial glow — centre */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(201,169,98,0.06) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Bottom fade to next section */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"
          aria-hidden
        />

        {/* Floating glass panels */}
        {PANELS.map((p, i) => (
          <div
            key={p.label}
            className={`absolute hidden sm:flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 backdrop-blur-md ${p.position} ${p.floatClass} panel-in`}
            style={{
              background: "rgba(255,255,255,0.05)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
              animationDelay: `${0.9 + i * 0.15}s`,
              minWidth: 172,
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(201,169,98,0.12)", color: "rgba(201,169,98,0.85)" }}
            >
              {p.icon}
            </div>
            <div>
              <p className="text-[11px] font-medium text-white/90 leading-tight">{p.label}</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-white/35">{p.sub}</p>
            </div>
          </div>
        ))}

        {/* Central content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="hero-fade-up text-[10px] uppercase tracking-[0.55em] text-gold/70"
            style={{ animationDelay: "0.1s" }}
          >
            Stylix — AI Luxury Styling
          </p>

          <h1
            className="hero-fade-up mt-6 font-serif text-[2.6rem] leading-[1.08] text-white sm:text-[3.5rem] lg:text-[4.75rem] xl:text-[5.5rem]"
            style={{ animationDelay: "0.25s", textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}
          >
            Your Personal
            <br />
            AI Stylist
          </h1>

          <p
            className="hero-fade-up mt-6 max-w-md text-[0.9375rem] leading-[1.8] text-white/55 sm:text-base"
            style={{ animationDelay: "0.45s" }}
          >
            Discover jewelry that matches your identity,
            style, and occasion.
          </p>

          <div
            className="hero-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
            style={{ animationDelay: "0.65s" }}
          >
            <Link
              href="/advisor"
              className="inline-flex items-center justify-center px-9 py-4 text-[11px] uppercase tracking-[0.25em] font-medium bg-white text-black transition-all duration-500 hover:bg-white/90"
            >
              Try AI Stylist
            </Link>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center px-9 py-4 text-[11px] uppercase tracking-[0.25em] font-medium border border-white/30 text-white transition-all duration-500 hover:bg-white/10"
            >
              Explore Collection
            </Link>
          </div>
        </div>

      </section>
    </>
  );
}
