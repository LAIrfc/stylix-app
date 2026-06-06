import { products } from "@/lib/data/products";
import { Product3DAdminClient } from "./Product3DAdminClient";

export const metadata = { title: "3D Product Models — Stylix Admin" };

export default function AdminProduct3DPage() {
  const initialProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.coverImage,
    model3dUrl: product.model3dUrl ?? product.modelUrl ?? product.model3D ?? null,
  }));

  return <Product3DAdminClient initialProducts={initialProducts} />;
}
