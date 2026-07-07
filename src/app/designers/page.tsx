import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "设计师合作 - Stylix",
};

const designerProducts = products.filter((product) => product.tags.collectionCategory === "designer-capsule");
const designerName = designerProducts[0]?.collaboratorName ?? "KK WANG Jewelry";
const designerBio = designerProducts[0]?.collaboratorBio ?? "独立珠宝设计工作室，专注带有象征意义的日常佩戴珠宝。";

export default function DesignersPage() {
  return (
    <div className="min-h-screen bg-ivory pt-16 text-ink-deep">
      <section className="bg-ink-deep text-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_420px] lg:px-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">设计师合作</p>
            <h1 className="mt-5 font-serif text-5xl leading-none text-ivory sm:text-6xl">{designerName}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-ivory/58">{designerBio}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/58">合作店铺保留原有结构：设计师故事、胶囊商品、身份标签，以及通向 Try-On 和高级定制的路径。</p>
          </div>
          <div className="border border-gold/20 bg-gold/5 p-6">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">合作逻辑</p>
            <div className="mt-6 grid gap-4">
              {["星座与符号珠宝", "适合日常购买的价格带", "可进入 JMTI 推荐系统", "可延伸到高级定制"].map((item) => (
                <p key={item} className="border-b border-ivory/10 pb-3 text-sm text-ivory/65">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designerProducts.map((product) => (
            <article key={product.id} className="border border-ink/10 bg-white/70">
              <Link href={"/product/" + product.slug} className="relative block aspect-[4/5] overflow-hidden bg-stone-100">
                <Image src={product.coverImage} alt={product.name} fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </Link>
              <div className="p-5">
                <p className="text-[9px] uppercase tracking-[0.32em] text-gold-deep">{product.tags.collectionName}</p>
                <h2 className="mt-2 font-serif text-2xl text-ink-deep">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/55">{product.designerNote ?? product.narrative}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={"/product/" + product.slug} className="bg-ink px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-ivory">购买</Link>
                  <Link href={"/try-on?piece=" + product.slug} className="border border-ink/15 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-ink/55 hover:border-gold/40 hover:text-gold-deep">Try-On</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
