"use client";

import Link from "next/link";

const links = [
  { href: "/test", label: "JMTI 珠宝人格测试" },
  { href: "/try-on", label: "虚拟试戴" },
  { href: "/vip-atelier", label: "VIP 高级定制" },
  { href: "/designers", label: "设计师合作" },
  { href: "/daily", label: "Daily 每日身份" },
  { href: "/member", label: "会员中心" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ivory/10 bg-ink-soft/80">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl tracking-[0.08em] text-ivory">Stylix</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory-dim">
              用 JMTI 珠宝人格、每日推荐、虚拟试戴、高级定制和设计师合作，把今天的身份翻译成珠宝。
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">体验</p>
            <div className="mt-5 grid gap-2.5">
              {links.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-ivory-soft transition-colors hover:text-gold">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">会员</p>
            <div className="mt-5 grid gap-2.5">
              {links.slice(4).map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-ivory-soft transition-colors hover:text-gold">
                  {link.label}
                </Link>
              ))}
              <a href="mailto:zilailayimamuniyazi@gmail.com" className="text-sm text-ivory-soft transition-colors hover:text-gold">
                客服邮箱
              </a>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-ivory/10 pt-8 text-center text-xs text-ivory-dim/80">
          © {new Date().getFullYear()} Stylix. JMTI identity-led jewelry intelligence.
        </p>
      </div>
    </footer>
  );
}
