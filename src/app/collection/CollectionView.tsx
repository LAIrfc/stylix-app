"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { products } from "@/lib/data/products";
import type { JewelryCategory, CollectionCategory } from "@/lib/types/product";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

// ── Collection tabs ──────────────────────────────────────────────────────────

type CollectionTab = "all" | "designer-capsule" | "celestial-essentials" | "ai-concept-archive";

const collectionTabs: {
  key: CollectionTab;
  label: string;
  eyebrow: string;
  description: string;
}[] = [
  {
    key: "all",
    label: "All Pieces",
    eyebrow: "Stylix Edit",
    description:
      "The complete Stylix curation — designer capsules, celestial essentials, and concept archive pieces selected through the Stylix aesthetic lens.",
  },
  {
    key: "designer-capsule",
    label: "Designer Capsules",
    eyebrow: "Curated Designer Capsule",
    description:
      "Independent designer collaborations selected by Stylix. Each capsule is chosen for its alignment with the Stylix aesthetic — symbolic, considered, and identity-driven.",
  },
  {
    key: "celestial-essentials",
    label: "Celestial Essentials",
    eyebrow: "Stylix Signature",
    description:
      "Stylix signature pieces — symbolic jewelry curated for identity, mood, and occasion. Wearable, considered, and designed to carry meaning.",
  },
  {
    key: "ai-concept-archive",
    label: "AI Concept Archive",
    eyebrow: "Concept · Archive · Experimental",
    description:
      "Experimental pieces generated through the Stylix AI design process. Concept-stage and archive works — not all are available for purchase. Shown for inspiration and identity exploration.",
  },
];

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

const categoryLabels: Record<string, string> = {
  all: "All",
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

// ── Product card ──────────────────────────────────────────────────────────────

function CollectionProductCard({ product }: { product: (typeof products)[0] }) {
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
                Concept Archive
              </span>
            </div>
          )}
          {isDesigner && product.collaboratorName && (
            <div className="absolute top-3 left-3">
              <span className="bg-amber-900/80 px-2 py-1 text-[8px] uppercase tracking-[0.25em] text-amber-100">
                Selected by Stylix
              </span>
            </div>
          )}
        </div>
        <div className="pt-5 pb-8">
          {isDesigner && product.collaboratorName && (
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-700/70 mb-1">
              {product.collaboratorName} · Curated Designer Capsule
            </p>
          )}
          {!isDesigner && product.zodiacAffinity && product.zodiacAffinity.length > 0 && (
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-700/60 mb-2">
              {product.zodiacAffinity.slice(0, 3).join(" · ")}
            </p>
          )}
          <h3 className="font-serif text-lg text-stone-900 group-hover:text-amber-800 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-stone-500">{product.subtitle}</p>
          {isArchive ? (
            <p className="mt-3 text-xs text-stone-400 italic">Concept piece · Archive</p>
          ) : (
            <p className="mt-3 text-sm font-medium text-stone-800">
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = (searchParams.get("tab") as CollectionTab) ?? "all";
  const activeTab: CollectionTab = collectionTabs.some((t) => t.key === tabParam)
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

  const activeCollection = collectionTabs.find((t) => t.key === activeTab)!;

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
          <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700/70">
            Stylix · AI Luxury Styling Platform
          </p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 sm:text-5xl">Collection</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-500">
            Curated jewelry for identity, mood, and occasion — designer capsules and signature pieces
            selected through the Stylix aesthetic lens.
          </p>
        </div>
      </div>

      {/* ── Collection tabs ───────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex gap-0 overflow-x-auto">
            {collectionTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTab(tab.key)}
                className={`shrink-0 border-b-2 px-5 py-4 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  activeTab === tab.key
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* ── Collection description ─────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl">
          <p className="text-[9px] uppercase tracking-[0.4em] text-amber-700/60 mb-2">
            {activeCollection.eyebrow}
          </p>
          <p className="text-sm leading-relaxed text-stone-500">{activeCollection.description}</p>
          {activeTab === "designer-capsule" && (
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Independent designer collaboration · Selected by Stylix
            </p>
          )}
          {activeTab === "ai-concept-archive" && (
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              These pieces are experimental and concept-stage. Some are available for bespoke
              commission through the Private Atelier.
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
              {categoryLabels[key] ?? key}
            </button>
          ))}
        </div>

        {/* ── Count ────────────────────────────────────────────────── */}
        <p className="mb-8 text-xs text-stone-400 uppercase tracking-[0.2em]">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          {activeTab === "all" && (
            <span className="ml-2 text-stone-300">
              · AI Concept Archive pieces shown in full under the Archive tab
            </span>
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
            <p className="font-serif text-2xl text-stone-300">No pieces in this category</p>
            <p className="mt-3 text-sm text-stone-400">
              Our atelier is building this collection — return soon.
            </p>
          </div>
        )}

        {/* ── Archive CTA ───────────────────────────────────────────── */}
        {activeTab === "all" && (
          <div className="mt-16 border-t border-stone-100 pt-12 text-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 mb-3">
              AI Concept Archive
            </p>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Experimental and concept-stage pieces generated through the Stylix AI design process.
            </p>
            <button
              type="button"
              onClick={() => setTab("ai-concept-archive")}
              className="mt-6 border border-stone-300 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              Explore Concept Archive →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
