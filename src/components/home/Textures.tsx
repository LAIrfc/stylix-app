import { SectionHeading } from "@/components/ui/SectionHeading";

export function Textures() {
  return (
    <section className="border-t border-ivory/10 bg-ink-soft/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-3">
          <SectionHeading title="Bold silhouettes" eyebrow="Design language" />
          <div className="lg:col-span-2">
            <p className="text-lg font-serif leading-relaxed text-ivory md:text-xl">
              Form follows feeling: weight that reassures, edges that catch light, textures that
              reward the hand. Craftsmanship is visible in restraint — the seam you almost miss,
              the hinge that disappears.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="border-l border-gold/30 pl-6">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Silhouette</p>
                <p className="mt-3 text-sm text-ivory-dim">
                  Architectural cuffs, lunar arcs, whisper-thin chains — each line negotiates with
                  the body.
                </p>
              </div>
              <div className="border-l border-gold/30 pl-6">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Texture</p>
                <p className="mt-3 text-sm text-ivory-dim">
                  Brushed gold, glass-smooth enamel, constellations of moissanite — tactility as
                  part of the narrative.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
