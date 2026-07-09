"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const paths = [
  {
    href: "/test",
    label: "JMTI 测试",
    title: "完成珠宝人格测试",
    body: "用 L/O、M/T、A/S、D/G 四维度生成 16 型珠宝人格，并转成今日推荐卡。",
  },
  {
    href: "/try-on",
    label: "Try-On",
    title: "上传照片试戴",
    body: "选择珠宝并上传照片，预览佩戴效果；后续预留 VR 试戴入口。",
  },
  {
    href: "/vip-atelier",
    label: "VIP Atelier",
    title: "提交高级定制预约",
    body: "选择材质、宝石、故事和预算，后续由设计师协助确认定制方案。",
  },
  {
    href: "/designers",
    label: "设计师合作",
    title: "进入合作店铺",
    body: "设计师合作款会进入 JMTI 推荐系统，也可以直接在商城筛选购买。",
  },
];

function StarChart() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-0 rounded-full border border-gold/20 bg-ink-soft/20 shadow-luxury" />
      <div className="absolute inset-[7%] rounded-full border border-ivory/10" />
      <div className="absolute inset-[18%] rounded-full border border-gold/20" />
      <div className="absolute inset-[31%] rounded-full border border-ivory/10" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-px -translate-x-1/2 -translate-y-1/2 rotate-[28deg] bg-gold/20" />
      <div className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-x-1/2 -translate-y-1/2 rotate-[112deg] bg-ivory/10" />
      <div className="absolute left-[19%] top-[28%] h-2 w-2 rounded-full bg-gold shadow-[0_0_28px_rgba(201,169,98,0.9)]" />
      <div className="absolute right-[24%] top-[18%] h-1.5 w-1.5 rounded-full bg-ivory/80" />
      <div className="absolute bottom-[24%] left-[28%] h-1.5 w-1.5 rounded-full bg-rosegold" />
      <div className="absolute bottom-[18%] right-[30%] h-2.5 w-2.5 rounded-full border border-gold/70" />
      <div className="absolute inset-[39%] rounded-full bg-gold/10 blur-xl" />
      <div className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg]">
        <Image src="/ring1.svg" alt="Daily jewelry orbit" width={360} height={360} className="h-auto w-full opacity-90 drop-shadow-[0_20px_60px_rgba(201,169,98,0.22)]" priority />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[9px] uppercase tracking-[0.35em] text-gold/70">3D 星盘</p>
        <p className="mt-1 font-serif text-lg text-ivory">今日身份启动</p>
      </div>
    </div>
  );
}

function FirstVisitModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = "stylix_first_identity_prompt_closed";
    if (!window.localStorage.getItem(key)) setVisible(true);
  }, []);

  function close() {
    window.localStorage.setItem("stylix_first_identity_prompt_closed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-deep/70 px-4 pb-5 backdrop-blur-sm sm:items-center sm:pb-0">
      <div className="w-full max-w-lg border border-gold/25 bg-ink-soft p-7 shadow-luxury sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">新设备访问</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ivory">先生成你的珠宝人格。</h2>
          </div>
          <button type="button" onClick={close} className="h-8 w-8 border border-ivory/15 text-ivory/50 transition-colors hover:border-gold/40 hover:text-gold" aria-label="Close">
            ×
          </button>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ivory/60">
          首次访问建议先完成 JMTI 测试。测试后注册保存档案，系统会结合星座、场景、风格和预算生成今日珠宝推荐。
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/test" onClick={close} className="inline-flex justify-center bg-gold px-7 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-ink-deep transition-colors hover:bg-gold-light">
            开始测试
          </Link>
          <button type="button" onClick={close} className="border border-ivory/15 px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:border-ivory/30 hover:text-ivory">
            先逛逛
          </button>
        </div>
      </div>
    </div>
  );
}

export function IdentityHome() {
  return (
    <>
      <FirstVisitModal />
      <section className="relative min-h-screen overflow-hidden bg-ink-deep pt-16">
        <div className="absolute inset-0">
          <Image src="/hero-editorial.jpg" alt="Stylix editorial jewelry" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.96),rgba(5,5,5,0.78),rgba(5,5,5,0.94))]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-[1fr_520px] lg:px-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">AI 珠宝身份系统</p>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl">
              把今日身份，翻译成一件珠宝。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/62">
              Stylix 用 JMTI 珠宝人格、星盘、场景和预算生成每日身份卡，给出三档珠宝推荐，并直接进入试戴、购买或高级定制。
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/test" className="inline-flex justify-center bg-gold px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-ink-deep transition-colors hover:bg-gold-light">
                生成今日身份
              </Link>
              <Link href="/daily" className="inline-flex justify-center border border-ivory/20 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold">
                Daily 身份卡
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["16", "JMTI 珠宝人格"],
                ["12", "星座信号"],
                ["3", "推荐价格档"],
              ].map(([value, label]) => (
                <div key={label} className="border border-ivory/10 bg-ink-soft/35 px-5 py-4">
                  <p className="font-serif text-3xl text-gold">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-ivory/38">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <StarChart />
        </div>
      </section>

      <section className="bg-ivory py-20 text-ink-deep">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-8 border-b border-ink/10 pb-10 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-gold-deep">四个主入口</p>
              <h2 className="mt-4 font-serif text-4xl text-ink-deep sm:text-5xl">从测试到推荐，再到试戴和定制。</h2>
            </div>
            <Link href="/shop" className="text-[11px] uppercase tracking-[0.25em] text-ink/60 transition-colors hover:text-gold-deep">
              浏览商城
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {paths.map((item) => (
              <Link key={item.href} href={item.href} className="group border border-ink/10 bg-white/55 p-6 transition-colors hover:border-gold/50">
                <p className="text-[9px] uppercase tracking-[0.35em] text-gold-deep">{item.label}</p>
                <h3 className="mt-5 font-serif text-2xl text-ink-deep">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-ink/58">{item.body}</p>
                <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-ink/45 transition-colors group-hover:text-gold-deep">进入</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
