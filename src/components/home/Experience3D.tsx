import { ButtonLink } from "@/components/ui/Button";
import { Jewelry3DPlaceholder } from "@/components/product/Jewelry3DPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience3D() {
  return (
    <section className="border-t border-ivory/10 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <SectionHeading
            eyebrow="Immersive viewing"
            title="See light travel across every facet"
          />
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-ivory-dim">
            Our 3D experience is built for slow looking — the way clients lean in at a private
            viewing. Rotate, zoom, and understand how a piece occupies space before it ever
            touches skin.
          </p>
          <div className="mt-10">
            <ButtonLink href="/collection" variant="outline">
              Explore Collection
            </ButtonLink>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <Jewelry3DPlaceholder label="Rotating preview · glTF ready" />
        </div>
      </div>
    </section>
  );
}
