"use client";

import Link from "next/link";

const pillars = [
  {
    number: "01",
    title: "Zodiac Identity Profile",
    body: "Your sun sign shapes your symbolic vocabulary — the materials, motifs, and energies that resonate with who you are. Stylix anchors every recommendation to your celestial signature.",
  },
  {
    number: "02",
    title: "Personal Aesthetic Profile",
    body: "Classic, celestial, bold, minimalist, romantic — your aesthetic determines the visual language of your jewelry. We don't guess; we ask.",
  },
  {
    number: "03",
    title: "Occasion Intelligence",
    body: "A piece for a black-tie evening reads differently than one worn to a board meeting or a weekend brunch. Stylix understands context — and matches accordingly.",
  },
  {
    number: "04",
    title: "Symbolic Material Matching",
    body: "18K champagne gold for warmth and confidence. Black onyx for depth and transformation. Sterling silver for clarity and intuition. Every material carries meaning — and we match it to yours.",
  },
  {
    number: "05",
    title: "Styling Rationale",
    body: "Every recommendation comes with an explanation: why this piece, why this material, why this moment. Not a product link — a reasoned case for your consideration.",
  },
  {
    number: "06",
    title: "Private Atelier Customization",
    body: "When the standard collection isn't enough, Private Atelier clients request material upgrades, engraving, gemstone substitutions, and bespoke commissions guided by Stylix AI.",
  },
];

export function HowStylixUnderstands() {
  return (
    <section className="bg-ink-deep py-28 lg:py-36 border-t border-ivory/8">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr] lg:items-start">
          {/* Left label column */}
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">The Intelligence</p>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-ivory lg:text-4xl">
              How Stylix understands you
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-ivory-dim/80 max-w-xs">
              Six dimensions of identity — combined into one symbolic styling profile.
            </p>
            <Link
              href="/advisor"
              className="mt-10 inline-flex text-[10px] uppercase tracking-[0.35em] text-gold transition-colors hover:text-gold-light"
            >
              Discover Your Jewelry Identity →
            </Link>
          </div>

          {/* Right pillars grid */}
          <div className="grid gap-px bg-ivory/8 border border-ivory/8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.number}
                className="group bg-ink-deep p-8 transition-colors duration-500 hover:bg-ink-soft/60 lg:p-10"
              >
                <p className="font-mono text-[10px] text-gold/30">{p.number}</p>
                <h3 className="mt-4 font-serif text-lg leading-snug text-ivory">{p.title}</h3>
                <div className="my-5 h-px w-8 bg-gold/20 transition-all duration-500 group-hover:w-12" />
                <p className="text-sm leading-relaxed text-ivory-dim/75">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
