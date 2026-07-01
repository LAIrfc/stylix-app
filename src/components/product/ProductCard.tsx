"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

export function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const { t } = useI18n();
  const isArchive = product.tags.collectionCategory === "ai-concept-archive";
  const isDesigner = product.tags.collectionCategory === "designer-capsule";

  return (
    <article
      className={`group flex flex-col border border-stone-100 bg-white shadow-sm transition-all hover:border-stone-300 hover:shadow-md ${
        compact ? "" : ""
      }`}
    >
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-stone-50">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
            isArchive ? "opacity-80" : ""
          }`}
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {isArchive && (
          <div className="absolute top-3 left-3">
            <span className="bg-stone-800/70 px-2 py-1 text-[8px] uppercase tracking-[0.25em] text-stone-200">
              {t.product.conceptArchive}
            </span>
          </div>
        )}
        {isDesigner && product.collaboratorName && (
          <div className="absolute top-3 left-3">
            <span className="bg-amber-900/80 px-2 py-1 text-[8px] uppercase tracking-[0.25em] text-amber-100">
              {t.product.selectedByStylix}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        {isDesigner && product.collaboratorName ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700/80">
            {product.collaboratorName} · {t.product.designerCapsule}
          </p>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">{product.category}</p>
        )}
        <h3 className="mt-2 font-serif text-xl text-stone-900">{product.name}</h3>
        <p className="mt-1 text-sm text-stone-500">{product.subtitle}</p>
        {isArchive ? (
          <p className="mt-4 text-xs text-stone-400 italic">{t.product.conceptPieceArchive}</p>
        ) : (
          <p className="mt-4 font-sans text-sm text-stone-700">
            {product.priceLabel ?? `$${product.price.toLocaleString()}`}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {product.tags.styleTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="border border-stone-200 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <ButtonLink href={`/product/${product.slug}`} variant="outline" className="w-full py-2.5">
            {t.product.viewDetails}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
