"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const stones = ["月光石", "钻石", "珍珠", "祖母绿", "黑玛瑙", "紫水晶"];
const metals = ["18K 黄金", "白金", "玫瑰金", "925 银", "铂金"];
const forms = ["戒指", "项链", "手链", "耳饰", "吊坠"];
const budgets = ["$300-600", "$600-1,200", "$1,200-3,000", "$3,000+ 高定"];

function Pick({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={"border px-4 py-3 text-left text-sm transition-colors " + (active ? "border-gold bg-gold/10 text-gold" : "border-ivory/12 text-ivory/58 hover:border-gold/35 hover:text-ivory")}>{children}</button>
  );
}

export function VipAtelierClient() {
  const [stone, setStone] = useState(stones[0]);
  const [metal, setMetal] = useState(metals[0]);
  const [form, setForm] = useState(forms[0]);
  const [budget, setBudget] = useState(budgets[1]);
  const [story, setStory] = useState("");
  const [email, setEmail] = useState("");

  const brief = useMemo(() => {
    return `${metal} ${stone} ${form}，预算 ${budget}。`;
  }, [budget, form, metal, stone]);

  const mailto = "mailto:zilailayimamuniyazi@gmail.com?subject=Stylix VIP Atelier Brief&body=" + encodeURIComponent(brief + "\n\nStory: " + story + "\nEmail: " + email);

  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <section>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">VIP Atelier 高级定制</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-none text-ivory sm:text-6xl">先 DIY 方向，再由设计师细化材质。</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-ivory/58">这是轻量版私人定制入口：选择宝石、金属、品类和预算，系统生成定制 brief，后续由设计师跟进材质和工艺。</p>

            <div className="mt-10 grid gap-8 xl:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold/70">宝石</p>
                <div className="grid gap-2 sm:grid-cols-2">{stones.map((item) => <Pick key={item} active={stone === item} onClick={() => setStone(item)}>{item}</Pick>)}</div>
              </div>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold/70">金属</p>
                <div className="grid gap-2 sm:grid-cols-2">{metals.map((item) => <Pick key={item} active={metal === item} onClick={() => setMetal(item)}>{item}</Pick>)}</div>
              </div>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold/70">品类</p>
                <div className="grid gap-2 sm:grid-cols-2">{forms.map((item) => <Pick key={item} active={form === item} onClick={() => setForm(item)}>{item}</Pick>)}</div>
              </div>
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold/70">预算</p>
                <div className="grid gap-2">{budgets.map((item) => <Pick key={item} active={budget === item} onClick={() => setBudget(item)}>{item}</Pick>)}</div>
              </div>
            </div>
          </section>

          <aside className="border border-gold/20 bg-gold/5 p-6 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">定制 brief</p>
            <h2 className="mt-4 font-serif text-3xl text-ivory">{brief}</h2>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="这件珠宝想纪念什么？可以写场景、人物、日期或风格。" className="mt-6 min-h-28 w-full border border-ivory/12 bg-ink-deep px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="设计师回访邮箱" className="mt-3 w-full border border-ivory/12 bg-ink-deep px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50" />
            <a href={mailto} className="mt-5 inline-flex w-full justify-center bg-gold px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-ink-deep">
              联系设计师
            </a>
            <Link href="/test" className="mt-3 inline-flex w-full justify-center border border-ivory/15 px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-ivory/55 hover:border-gold/40 hover:text-gold">
              先做 JMTI 测试
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
