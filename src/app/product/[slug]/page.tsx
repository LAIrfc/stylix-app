import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/data/products";
import { Product3DViewer } from "@/components/product/Product3DViewer";
import { ButtonLink } from "@/components/ui/Button";
import { AddToBag } from "@/components/product/AddToBag";
import { ProductPageTracker } from "@/components/product/ProductPageTracker";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/product";
import { isValidGlbUrl } from "@/lib/utils/model3d";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getStoredModel3dUrl(product: Product) {
  try {
    const db = getSupabaseAdmin();
    const { data: dbProduct, error: productError } = await db
      .schema("public")
      .from("products")
      .select("id")
      .eq("slug", product.slug)
      .maybeSingle();

    if (productError) {
      console.error("[product/3d] product lookup failed", {
        slug: product.slug,
        message: productError.message,
      });
      return null;
    }

    const productId = (dbProduct as { id?: string } | null)?.id;
    if (!productId) return null;

    const { data: asset, error: assetError } = await db
      .schema("public")
      .from("product_assets")
      .select("model_3d_url")
      .eq("product_id", productId)
      .not("model_3d_url", "is", null)
      .limit(1)
      .maybeSingle();

    if (assetError) {
      console.error("[product/3d] model asset lookup failed", {
        slug: product.slug,
        message: assetError.message,
      });
      return null;
    }

    const model3dUrl = (asset as { model_3d_url?: string | null } | null)?.model_3d_url ?? null;
    return isValidGlbUrl(model3dUrl) ? model3dUrl : null;
  } catch (err) {
    console.error("[product/3d] stored model lookup skipped", err);
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  noStore();
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);
  const catalogModelUrl = product.model3dUrl ?? product.modelUrl ?? product.model3D ?? null;
  const storedModelUrl = await getStoredModel3dUrl(product);
  const modelUrl = storedModelUrl ?? (isValidGlbUrl(catalogModelUrl) ? catalogModelUrl : null);

  return (
    <div className="pt-24">
      <ProductPageTracker productId={product.id} />
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* ── Left: imagery + 3D ─────────────────────────────────── */}
          <div>
            <div className="relative aspect-[3/4] border border-ivory/10 bg-ink-soft">
              <Image
                src={product.coverImage}
                alt={product.name}
                fill
                className="object-contain object-center"
                priority
                sizes="50vw"
              />
            </div>
            {modelUrl && (
              <div className="mt-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">3D Preview</p>
                <div className="mt-4 max-w-md">
                  <Product3DViewer
                    modelUrl={modelUrl}
                    productName={product.name}
                    productId={product.id}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Right: identity + product detail ──────────────────── */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{product.tags.collectionName}</p>
              {product.zodiacAffinity && product.zodiacAffinity.length > 0 && (
                <>
                  <span className="text-ivory/20">·</span>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">
                    {product.zodiacAffinity.join(", ")}
                  </p>
                </>
              )}
            </div>

            <h1 className="mt-4 font-serif text-4xl text-ivory md:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg text-ivory-soft">{product.subtitle}</p>
            <p className="mt-8 text-2xl text-ivory">
              {product.priceLabel ?? `$${product.price.toLocaleString()}`}
            </p>

            <p className="mt-8 text-sm leading-relaxed text-ivory-dim">{product.description}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory-soft">{product.narrative}</p>

            {/* ── Symbolism ──────────────────────────────────────── */}
            {product.symbolism && (
              <div className="mt-10 border-t border-ivory/10 pt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Design Symbolism</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory-dim italic">{product.symbolism}</p>
              </div>
            )}

            {/* ── Material energy ───────────────────────────────── */}
            {product.materialEnergy && (
              <div className="mt-8 border-t border-ivory/10 pt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Material & Energy</p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-ivory/50">{product.material}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory-dim">{product.materialEnergy}</p>
              </div>
            )}

            {/* ── Styling notes ─────────────────────────────────── */}
            {product.stylingNotes && (
              <div className="mt-8 border-t border-ivory/10 pt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Styling Notes</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory-dim">{product.stylingNotes}</p>
              </div>
            )}

            {/* ── Tags ──────────────────────────────────────────── */}
            <div className="mt-8 flex flex-wrap gap-2">
              {product.tags.styleTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-ivory/12 px-3 py-1 text-[10px] uppercase tracking-wider text-ivory/50"
                >
                  {tag}
                </span>
              ))}
              {product.tags.occasionTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-gold/20 px-3 py-1 text-[10px] uppercase tracking-wider text-gold/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Customization options ─────────────────────────── */}
            {product.customizationOptions && product.customizationOptions.length > 0 && (
              <div className="mt-8 border-t border-ivory/10 pt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Private Atelier Customization</p>
                <ul className="mt-4 space-y-2">
                  {product.customizationOptions.map((opt) => (
                    <li key={opt} className="flex items-start gap-3 text-sm text-ivory-dim">
                      <span className="mt-1.5 h-px w-4 shrink-0 bg-gold/30" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Designer Note ──────────────────────────────────────── */}
            {product.collaboratorName && (
              <div className="mt-8 border-t border-ivory/10 pt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Designer Note</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ivory/50">{product.collaboratorName}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory-dim italic">
                  {product.designerNote ?? `Designed in collaboration with ${product.collaboratorName}.`}
                </p>
              </div>
            )}

            {/* ── CTAs ──────────────────────────────────────────── */}
            <div className="mt-12 space-y-4">
              <AddToBag product={product} />
              <div className="flex flex-wrap gap-4 pt-2">
                <ButtonLink href={`/try-on?piece=${product.slug}`} variant="outline">
                  Virtual Styling Preview
                </ButtonLink>
                <ButtonLink href="/advisor" variant="ghost" className="!px-0">
                  Request AI Styling
                </ButtonLink>
                <ButtonLink href="/vip" variant="ghost" className="!px-0">
                  Private Atelier
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related pieces ────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-ivory/10 pt-16">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-2xl text-ivory">Also from the collection</h2>
              <Link
                href="/collection"
                className="text-[10px] uppercase tracking-[0.3em] text-gold/70 transition-colors hover:text-gold"
              >
                Explore Collection →
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group border border-ivory/10 transition-colors hover:border-gold/30"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={p.coverImage}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="30vw"
                    />
                  </div>
                  <div className="p-6">
                    {p.zodiacAffinity && (
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-1">
                        {p.zodiacAffinity.slice(0, 2).join(" · ")}
                      </p>
                    )}
                    <p className="font-serif text-lg text-ivory">{p.name}</p>
                    <p className="mt-1 text-sm text-ivory-dim">{p.subtitle}</p>
                    <p className="mt-2 text-xs text-ivory/40">{p.priceLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
