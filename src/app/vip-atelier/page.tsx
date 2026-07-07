import type { Metadata } from "next";
import { VipAtelierClient } from "./VipAtelierClient";

export const metadata: Metadata = {
  title: "VIP Atelier 高级定制 - Stylix",
};

export default function VipAtelierPage() {
  return <VipAtelierClient />;
}
