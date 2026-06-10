import { TryOnWaitlistGate } from "./TryOnWaitlistGate";

export const metadata = {
  title: "Virtual Try-On Early Access — Stylix",
};

export default function TryOnPage() {
  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      <TryOnWaitlistGate />
    </div>
  );
}
