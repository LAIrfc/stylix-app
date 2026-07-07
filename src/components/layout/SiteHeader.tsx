"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "@/lib/cart/CartContext";
import { useAuth } from "@/lib/auth/AuthContext";

const nav = [
  { href: "/test", label: "JMTI 测试" },
  { href: "/try-on", label: "Try-On" },
  { href: "/vip-atelier", label: "高级定制" },
  { href: "/designers", label: "设计师合作" },
];

function isActive(pathname: string, href: string) {
  if (href === "/test") return pathname === "/test" || pathname === "/result" || pathname === "/daily" || pathname === "/shop";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ivory/10 bg-ink-deep/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="font-serif text-lg tracking-[0.12em] text-ivory transition-colors hover:text-gold-light sm:text-xl">
          Stylix
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={"text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold " + (isActive(pathname, item.href) ? "text-gold" : "text-ivory-dim")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Link href="/daily" className="text-[10px] uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-gold">
            Daily
          </Link>
          <Link href="/bag" className="relative text-[10px] uppercase tracking-[0.2em] text-ivory/60 transition-colors hover:text-gold">
            购物袋
            {itemCount > 0 && <span className="ml-1 text-gold">({itemCount})</span>}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/member" className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-serif text-gold">
                {user.name.charAt(0).toUpperCase()}
              </Link>
              <button type="button" onClick={logout} className="text-[10px] uppercase tracking-[0.18em] text-ivory/35 hover:text-gold">
                退出
              </button>
            </div>
          ) : (
            <Link href="/test" className="border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink-deep">
              开始
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span className="h-px w-5 bg-ivory" />
          <span className="h-px w-5 bg-ivory" />
        </button>
      </div>

      {open && (
        <div className="border-t border-ivory/10 bg-ink-deep px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ivory-soft">
                {item.label}
              </Link>
            ))}
            <Link href="/daily" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ivory-soft">
              Daily
            </Link>
            <Link href="/shop" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ivory-soft">
              商城
            </Link>
            <Link href="/member" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ivory-soft">
              会员中心
            </Link>
            <Link href="/bag" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ivory-soft">
              购物袋 {itemCount > 0 && "(" + itemCount + ")"}
            </Link>
            {user && (
              <button type="button" onClick={() => { logout(); setOpen(false); }} className="text-left text-sm uppercase tracking-widest text-ivory-soft">
                退出
              </button>
            )}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
