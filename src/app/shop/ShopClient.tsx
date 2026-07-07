"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/lib/data/products";
import type { JewelryCategory, Product } from "@/lib/types/product";

type MaterialFilter = "all" | "gold" | "silver" | "diamond" | "pearl" | "colored-gem" | "jade";
type ColorFilter = "all" | "gold" | "silver-white" | "rose" | "black" | "blue" | "red" | "rainbow";
type PriceFilter = "all" | "under-250" | "250-500" | "500-1000" | "over-1000";
type SortMode = "recommend" | "price-asc" | "price-desc";

const materialOptions: { value: MaterialFilter; label: string; terms: string[] }[] = [
  { value: "all", label: "全部材质", terms: [] },
  { value: "gold", label: "黄金 / K金", terms: ["gold", "champagne", "yellow", "18k", "22k"] },
  { value: "silver", label: "银色 / 白金", terms: ["silver", "white gold", "rhodium"] },
  { value: "diamond", label: "钻石 / 莫桑石", terms: ["diamond", "moissanite", "zirconia"] },
  { value: "pearl", label: "珍珠 / 月光", terms: ["pearl", "moonstone", "moon"] },
  { value: "colored-gem", label: "彩宝", terms: ["sapphire", "ruby", "garnet", "opal", "turquoise", "amethyst", "citrine", "spectrum"] },
  { value: "jade", label: "玉石 / 翡翠", terms: ["jade", "emerald", "green"] },
];

const colorOptions: { value: ColorFilter; label: string; terms: string[] }[] = [
  { value: "all", label: "全部色系", terms: [] },
  { value: "gold", label: "金色系", terms: ["gold", "champagne", "yellow"] },
  { value: "silver-white", label: "银白系", terms: ["silver", "white", "pearl"] },
  { value: "rose", label: "玫瑰系", terms: ["rose", "pink"] },
  { value: "black", label: "黑灰系", terms: ["black", "charcoal", "onyx"] },
  { value: "blue", label: "蓝紫系", terms: ["blue", "aquamarine", "sapphire", "amethyst", "violet"] },
  { value: "red", label: "红酒系", terms: ["red", "ruby", "garnet", "wine"] },
  { value: "rainbow", label: "彩色系", terms: ["spectrum", "opal", "mixed", "color"] },
];

const priceOptions: { value: PriceFilter; label: string; match: (price: number) => boolean }[] = [
  { value: "all", label: "全部价格", match: () => true },
  { value: "under-250", label: "$250 以下", match: (price) => price < 250 },
  { value: "250-500", label: "$250 - $500", match: (price) => price >= 250 && price <= 500 },
  { value: "500-1000", label: "$500 - $1000", match: (price) => price > 500 && price <= 1000 },
  { value: "over-1000", label: "$1000 以上", match: (price) => price > 1000 },
];

const categoryOptions: { value: "all" | JewelryCategory; label: string }[] = [
  { value: "all", label: "全部品类" },
  { value: "rings", label: "戒指" },
  { value: "necklaces", label: "项链" },
  { value: "earrings", label: "耳饰" },
  { value: "bracelets", label: "手链" },
];

function productText(product: Product) {
  return [
    product.name,
    product.subtitle,
    product.description,
    product.narrative,
    product.material,
    product.symbolism,
    product.materialEnergy,
    product.tags.collectionName,
    product.tags.metalTone,
  ].join(" ").toLowerCase();
}

function matchesTerms(product: Product, terms: string[]) {
  if (!terms.length) return true;
  const text = productText(product);
  return terms.some((term) => text.includes(term.toLowerCase()));
}

export function ShopClient() {
  const [material, setMaterial] = useState<MaterialFilter>("all");
  const [color, setColor] = useState<ColorFilter>("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [category, setCategory] = useState<"all" | JewelryCategory>("all");
  const [sort, setSort] = useState<SortMode>("recommend");
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const materialConfig = materialOptions.find((item) => item.value === material) ?? materialOptions[0];
    const colorConfig = colorOptions.find((item) => item.value === color) ?? colorOptions[0];
    const priceConfig = priceOptions.find((item) => item.value === price) ?? priceOptions[0];
    const query = keyword.trim().toLowerCase();

    const result = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (!priceConfig.match(product.price)) return false;
      if (!matchesTerms(product, materialConfig.terms)) return false;
      if (!matchesTerms(product, colorConfig.terms)) return false;
      if (query && !productText(product).includes(query)) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return Number(b.isFeatured) - Number(a.isFeatured) || a.budgetTier - b.budgetTier;
    });
  }, [category, color, keyword, material, price, sort]);

  const hotSearch = ["通勤戒指", "珍珠", "金色系", "约会", "星座项链", "设计师款"];

  return (
    <div className="min-h-screen bg-ivory pt-16 text-ink-deep">
      <section className="border-b border-ink/10 bg-ink-deep text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">珠宝商城</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="font-serif text-5xl text-ivory sm:text-6xl">按材质、价格、色系挑珠宝。</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/55">这里先做成商品流商城，后面可把珠宝图片、材质、库存、价格和标签上传进来，再由 JMTI 推荐和 Try-On 直接调用。</p>
            </div>
            <div className="border border-ivory/10 bg-ivory/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">商品上传预留</p>
              <p className="mt-3 text-sm leading-6 text-ivory/55">字段建议：主图、图库、品类、材质、价格、色系、库存、JMTI 标签、场景标签、试戴素材、3D 模型。</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="border border-ink/10 bg-white/70 p-5 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold-deep">筛选</p>
            <div className="mt-5 space-y-6">
              <FilterGroup title="材质" options={materialOptions} value={material} onChange={setMaterial} />
              <FilterGroup title="价格" options={priceOptions} value={price} onChange={setPrice} />
              <FilterGroup title="色系" options={colorOptions} value={color} onChange={setColor} />
              <FilterGroup title="品类" options={categoryOptions} value={category} onChange={setCategory} />
            </div>
          </aside>

          <section>
            <div className="border border-ink/10 bg-white/70 p-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索戒指、珍珠、星座、材质或场景"
                    className="w-full border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink-deep outline-none focus:border-gold-deep/50"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hotSearch.map((item) => (
                      <button key={item} type="button" onClick={() => setKeyword(item)} className="border border-ink/10 px-3 py-1.5 text-xs text-ink/55 hover:border-gold-deep/40 hover:text-gold-deep">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink-deep outline-none">
                  <option value="recommend">综合推荐</option>
                  <option value="price-asc">价格从低到高</option>
                  <option value="price-desc">价格从高到低</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink/45">{filtered.length} 件商品</p>
              <Link href="/test" className="border border-gold-deep/25 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gold-deep hover:bg-gold-deep hover:text-ivory">
                做 JMTI 推荐
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <Link key={product.id} href={"/product/" + product.slug} className="group border border-ink/10 bg-white/80">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <Image src={product.coverImage} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="absolute left-3 top-3 bg-ivory/90 px-2 py-1 text-[10px] text-ink/60">{categoryOptions.find((item) => item.value === product.category)?.label}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-gold-deep">{product.tags.collectionName}</p>
                    <h2 className="mt-2 font-serif text-2xl text-ink-deep">{product.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/50">{product.subtitle}</p>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink/45">{product.material}</p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <p className="font-serif text-lg text-ink">{"$" + product.price}</p>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-ink/40 group-hover:text-gold-deep">查看</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-8 border border-dashed border-ink/15 p-10 text-center">
                <p className="font-serif text-2xl text-ink-deep">暂时没有匹配商品</p>
                <p className="mt-3 text-sm text-ink/50">可以放宽材质、价格或色系筛选；后续上传更多珠宝后这里会自动扩展。</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function FilterGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-ink/40">{title}</p>
      <div className="grid gap-2">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={"border px-4 py-2 text-left text-sm transition-colors " + (value === item.value ? "border-ink bg-ink text-ivory" : "border-ink/10 text-ink/55 hover:border-gold-deep/40")}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
