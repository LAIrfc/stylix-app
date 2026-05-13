import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Mythical() {
  return (
    <section className="relative overflow-hidden border-t border-ivory/10 py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-rosegold/5" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Narrative"
              title="Mythical inspirations, modern guardians"
            />
            <p className="mt-8 text-sm leading-relaxed text-ivory-dim">
              Collections draw from mythology, guardian archetypes, and timeless symbolism — not as
              costume, but as emotional shorthand. Each line is a story you wear: protection,
              desire, intellect, the moon&apos;s patience, the sun&apos;s certainty.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ivory-soft">
              Jewelry becomes a private language between you and the room you enter.
            </p>
          </div>
          <div className="relative aspect-[4/5] lg:col-span-7">
            <Image
              src="/hero-jewelry.svg"
              alt="Editorial jewelry still life"
              fill
              className="object-cover"
              sizes="60vw"
            />
            <div className="absolute bottom-8 left-8 max-w-xs border-l border-gold/40 pl-6">
              <p className="font-serif text-xl text-ivory">Celestial Guardians</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-gold">Vol. II</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
