import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export function Personalization() {
  return (
    <section className="border-t border-ivory/10 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <SectionHeading
          align="center"
          eyebrow="Bespoke"
          title="Personalized customization"
        />
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-ivory-dim">
          Beyond the edit, our atelier listens. Custom design translates your story into metal and
          stone — heirloom logic with contemporary silhouette. From remounting heritage gems to
          sketching an entirely new form, the process is guided, discreet, and uncompromising.
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/vip" variant="outline">
            Request a consultation
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
