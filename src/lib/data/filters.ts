import type { MaterialFilter, Product } from "@/lib/types/product";

export function productMatchesMaterial(p: Product, filter: MaterialFilter): boolean {
  const m = `${p.material} ${p.tags.metalTone}`.toLowerCase();
  switch (filter) {
    case "silver":
      return m.includes("silver") || m.includes("white gold");
    case "gold":
      return m.includes("gold") && !m.includes("rose");
    case "moissanite":
      return m.includes("moissanite");
    case "diamond-style":
      return m.includes("diamond") || m.includes("lab-grown");
    default:
      return true;
  }
}
