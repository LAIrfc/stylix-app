import { Hero } from "@/components/home/Hero";
import { CoreServices } from "@/components/home/CoreServices";
import { HowStylixUnderstands } from "@/components/home/HowStylixUnderstands";
import { CollectionPreview } from "@/components/home/CollectionPreview";
import { AdvisorSplit } from "@/components/home/AdvisorSplit";
import { FeaturedDesigner } from "@/components/home/FeaturedDesigner";
import { VipTeaser } from "@/components/home/VipTeaser";
import { StayUpdated } from "@/components/home/StayUpdated";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — platform identity, CTAs */}
      <Hero />

      {/* 2. Platform pillars — what Stylix does */}
      <CoreServices />

      {/* 3. Intelligence — how Stylix understands you */}
      <HowStylixUnderstands />

      {/* 4. Collection — designer capsules + signature pieces */}
      <CollectionPreview />

      {/* 5. AI Styling + Virtual Try-On — unified atelier experience */}
      <AdvisorSplit />

      {/* 6. Designer capsule spotlight */}
      <FeaturedDesigner />

      {/* 7. Private Atelier access */}
      <VipTeaser />

      {/* 8. Newsletter */}
      <StayUpdated />
    </>
  );
}
