"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { products } from "@/lib/data/products";
import type { JewelryCategory, CollectionCategory } from "@/lib/types/product";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";
import { useI18n } from "@/lib/i18n/context";

// ── Collection tabs ──────────────────────────────────────────────────────────

type CollectionTab = "all" | "designer-capsule" | "celestial-essentials" | "ai-concept-archive";

const collectionCategoryMap: Record<CollectionTab, CollectionCategory | null> = {
  all: null,
  "designer-capsule": "designer-capsule",
  "celestial-essentials": "celestial-essentials",
  "ai-concept-archive": "ai-concept-archive",
};

// ── Category filter ───────────────────────────────────────────────────────────

const categoryKeys: (JewelryCategory | "all")[] = [
  "all",
  "rings",
  "necklaces",
  "bracelets",
  "earrings",
];

// ── Product card ──────────────────────────────────────────────────────────────

function CollectionProductCard({ product }: { product: (typeof products)[0] }) {
  const { t } = useI18n();
  const isArchive = product.tags.collectionCategory === "ai-concept-archive";
  const isDesigner = product.tags.collectionCategory === "designer-capsule";

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
              isArchive ? "opacity-85" : ""
            }`}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
          {isArchive && (
            <div className="absolute top-3 left-3">
              <span className="bg-stone-900/70 px-2 py-1 text-[8px] uppercase tracking-[0.25em] text-stone-300">
                {t.collectionPage.badges.conceptArchive}
              </span>
            </div>
          )}
          {isDesigner && product.collaboratorName && (
            <div className="absolute top-3 left-3">
              <span className="bg-stone-800/80 px-2 py-1 text-[8px] uppercase tracking-[0.25em] text-stone-200">
                {t.collectionPage.badges.selectedByStylix}
              </span>
            </div>
          )}
        </div>
        <div className="pt-5 pb-8">
          {isDesigner && product.collaboratorName && (
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1">
              {product.collaboratorName} · {t.collectionPage.collaboratorCapsule}
            </p>
          )}
          {!isDesigner && product.zodiacAffinity && product.zodiacAffinity.length > 0 && (
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400/80 mb-2">
              {product.zodiacAffinity.slice(0, 3).join(" · ")}
            </p>
          )}
          <h3 className="font-serif text-lg text-stone-800 group-hover:text-stone-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-stone-500">{product.subtitle}</p>
          {isArchive ? (
            <p className="mt-3 text-xs text-stone-400 italic">{t.collectionPage.conceptPieceArchive}</p>
          ) : (
            <p className="mt-3 text-sm font-medium text-stone-700">
              {product.priceLabel ?? `$${product.price.toLocaleString()}`}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CollectionView() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabKeyMap = ["all", "designer-capsule", "celestial-essentials", "ai-concept-archive"] as const;
  const tabTranslationKey: Record<CollectionTab, keyof typeof t.collectionPage.tabs> = {
    all: "all",
    "designer-capsule": "designerCapsule",
    "celestial-essentials": "celestialEssentials",
    "ai-concept-archive": "aiConceptArchive",
  };

  const tabParam = (searchParams.get("tab") as CollectionTab) ?? "all";
  const activeTab: CollectionTab = tabKeyMap.includes(tabParam as CollectionTab)
    ? tabParam
    : "all";

  const [cat, setCat] = useState<JewelryCategory | "all">("all");

  useEffect(() => {
    track({ event_name: EVENTS.COLLECTION_VIEW, tool_name: activeTab });
  }, [activeTab]);

  function setTab(key: CollectionTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("tab");
    } else {
      params.set("tab", key);
    }
    router.push(`${pathname}?${params.toString()}`);
    setCat("all");
  }

  const filtered = useMemo(() => {
    const targetCategory = collectionCategoryMap[activeTab];
    return products.filter((p) => {
      if (targetCategory !== null && p.tags.collectionCategory !== targetCategory) return false;
      if (cat !== "all" && p.category !== cat) return false;
      // In "all" view, show designer-capsule and celestial-essentials prominently;
      // limit ai-concept-archive to only isFeatured pieces to avoid domination
      if (activeTab === "all" && p.tags.collectionCategory === "ai-concept-archive" && !p.isFeatured) {
        return false;
      }
      return true;
    });
  }, [activeTab, cat]);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400">
            {t.collectionPage.pageEyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-stone-800 sm:text-5xl">
            {t.collectionPage.pageTitle}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-400">
            {t.collectionPage.pageSubtitle}
          </p>
        </div>
      </div>

      {/* ── Collection tabs ───────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex gap-0 overflow-x-auto">
            {tabKeyMap.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`shrink-0 border-b-2 px-5 py-4 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  activeTab === key
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                {t.collectionPage.tabs[tabTranslationKey[key]].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* ── Collection description ─────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl">
          <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-2">
            {t.collectionPage.tabs[tabTranslationKey[activeTab]].eyebrow}
          </p>
          <p className="text-sm leading-relaxed text-stone-500">
            {t.collectionPage.tabs[tabTranslationKey[activeTab]].description}
          </p>
          {activeTab === "designer-capsule" && (
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              {t.collectionPage.designerCapsuleNote}
            </p>
          )}
          {activeTab === "ai-concept-archive" && (
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              {t.collectionPage.archiveNote}
            </p>
          )}
        </div>

        {/* ── Product type filter ──────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categoryKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCat(key)}
              className={`border px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                cat === key
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700"
              }`}
            >
              {t.collection.categoryLabels[key] ?? key}
            </button>
          ))}
        </div>

        {/* ── Count ────────────────────────────────────────────────── */}
        <p className="mb-8 text-xs text-stone-400 uppercase tracking-[0.2em]">
          {filtered.length} {filtered.length === 1 ? t.collection.piece : t.collection.pieces}
          {activeTab === "all" && (
            <span className="ml-2 text-stone-300">{t.collectionPage.allTabArchiveHint}</span>
          )}
        </p>

        {/* ── Product grid ─────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <CollectionProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-stone-200 py-20 text-center">
            <p className="font-serif text-2xl text-stone-300">{t.collectionPage.emptyTitle}</p>
            <p className="mt-3 text-sm text-stone-400">{t.collectionPage.emptyBody}</p>
          </div>
        )}

        {/* ── Archive CTA ───────────────────────────────────────────── */}
        {activeTab === "all" && (
          <div className="mt-16 border-t border-stone-100 pt-12 text-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-3">
              {t.collectionPage.archiveCta.eyebrow}
            </p>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              {t.collectionPage.archiveCta.description}
            </p>
            <button
              type="button"
              onClick={() => setTab("ai-concept-archive")}
              className="mt-6 border border-stone-300 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              {t.collectionPage.archiveCta.button}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
