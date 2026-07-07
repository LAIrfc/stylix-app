"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { buildDailyIdentityCard, emptyJmtiScores, getStoredIdentityAnswers, type IdentityAnswers } from "@/lib/identity/engine";

const fallbackAnswers: IdentityAnswers = {
  jmtiCode: "OMAD",
  jmtiScores: { ...emptyJmtiScores(), O: 5, M: 4, A: 4, D: 5 },
  matchPercent: 62,
  zodiac: "Pisces",
  occasion: "date night",
  style: "celestial",
  budgetMax: 500,
};

export function MemberClient() {
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const [answers, setAnswers] = useState<IdentityAnswers>(fallbackAnswers);
  const [checkins, setCheckins] = useState<string[]>([]);
  const card = useMemo(() => buildDailyIdentityCard(answers), [answers]);
  const level = checkins.length >= 20 ? "Atelier Gold" : checkins.length >= 7 ? "Lunar Silver" : "New Star";

  useEffect(() => {
    const stored = getStoredIdentityAnswers();
    if (stored) setAnswers(stored);
    const raw = window.localStorage.getItem("stylix_daily_checkins");
    setCheckins(raw ? (JSON.parse(raw) as string[]) : []);
  }, []);

  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <section className="grid gap-8 border border-gold/20 bg-ink-soft/30 p-7 shadow-luxury lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">会员中心</p>
            <h1 className="mt-5 font-serif text-5xl leading-none text-ivory">{user ? user.name : "游客档案"}</h1>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-ivory/35">JMTI {answers.jmtiCode} / {card.archetype}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/58">这里集中管理身份档案、收藏、打卡、订单和等级。现在先用本地档案，后续可替换为 Supabase 用户数据。</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/test" className="bg-gold px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-ink-deep">更新测试</Link>
              <Link href="/daily" className="border border-gold/30 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-gold hover:bg-gold hover:text-ink-deep">每日打卡</Link>
            </div>
          </div>
          <div className="border border-ivory/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">会员等级</p>
            <p className="mt-3 font-serif text-3xl text-ivory">{level}</p>
            <p className="mt-3 text-sm leading-6 text-ivory/50">{checkins.length} 次打卡。累计 7 次升级 Lunar Silver，20 次升级 Atelier Gold。</p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="border border-ivory/10 bg-ink-soft/20 p-6">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">身份档案</p>
            <h2 className="mt-3 font-serif text-2xl text-ivory">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ivory/55">幸运色：{card.luckyColor}。幸运珠宝：{card.luckyGemstone}。</p>
            <p className="mt-3 text-sm leading-6 text-ivory/55">{card.recommendationReason}</p>
          </section>

          <section className="border border-ivory/10 bg-ink-soft/20 p-6">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">购物袋与订单</p>
            <h2 className="mt-3 font-serif text-2xl text-ivory">{items.length} 件已加入购物袋</h2>
            <p className="mt-3 text-sm text-ivory/55">{"小计：$" + subtotal.toFixed(2)}</p>
            <div className="mt-5 grid gap-3">
              <Link href="/bag" className="border border-gold/30 px-5 py-3 text-center text-[10px] uppercase tracking-[0.22em] text-gold hover:bg-gold hover:text-ink-deep">查看购物袋</Link>
              <Link href="/checkout" className="border border-ivory/15 px-5 py-3 text-center text-[10px] uppercase tracking-[0.22em] text-ivory/55 hover:border-gold/40 hover:text-gold">去结算</Link>
            </div>
          </section>

          <section className="border border-ivory/10 bg-ink-soft/20 p-6">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">打卡记录</p>
            <h2 className="mt-3 font-serif text-2xl text-ivory">{checkins.length} 次 Daily 记录</h2>
            <div className="mt-5 max-h-32 space-y-2 overflow-auto pr-2">
              {checkins.length === 0 && <p className="text-sm text-ivory/45">还没有打卡记录。</p>}
              {checkins.slice().reverse().map((day) => (
                <p key={day} className="border-b border-ivory/8 pb-2 text-sm text-ivory/55">{day}</p>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 border border-ivory/10 bg-ivory text-ink-deep">
          <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
            <div className="relative aspect-square bg-stone-100 lg:aspect-auto">
              <Image src={card.products.signature.coverImage} alt={card.products.signature.name} fill className="object-cover" sizes="320px" />
            </div>
            <div className="p-7">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold-deep">收藏预留</p>
              <h2 className="mt-3 font-serif text-3xl text-ink-deep">先收藏今日标志款。</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/58">接入真实后端后，用户收藏、浏览记录、订单和每日推荐可以全部沉淀到这里。</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={"/product/" + card.products.signature.slug} className="bg-ink px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-ivory">查看商品</Link>
                <Link href={"/try-on?piece=" + card.products.signature.slug} className="border border-ink/15 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-ink/55 hover:border-gold/40 hover:text-gold-deep">Try-On</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
