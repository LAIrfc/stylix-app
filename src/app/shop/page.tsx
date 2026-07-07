import type { Metadata } from "next";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Identity Shop - Stylix",
};

export default function ShopPage() {
  return <ShopClient />;
}
