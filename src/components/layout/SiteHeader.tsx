"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "@/lib/cart/CartContext";
import { useAuth } from "@/lib/auth/AuthContext";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const tryOnTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const tryOnItems = [
    { href: "/try-on", label: t.nav.arTryOn },
    { href: "/identity-portrait", label: t.nav.identityPortrait },
  ];

  const nav = [
    { href: "/collection", label: t.nav.collection },
    { href: "/advisor", label: t.nav.advisor },
    { href: "/collection?tab=designer-capsule", label: t.nav.designerCapsule },
    { href: "/vip", label: t.nav.vip },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ivory/10 bg-ink-deep/92 backdrop-blur-md" style={{ overflow: "visible" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="font-serif text-lg tracking-[0.12em] text-ivory transition-colors hover:text-gold-light sm:text-xl"
        >
          Stylix
        </Link>
        <nav className="hidden items-center gap-8 lg:gap-10 md:flex">
          {nav.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold whitespace-nowrap ${
                pathname === item.href ? "text-gold" : "text-ivory-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Try-On dropdown */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => {
              if (tryOnTimeout.current) clearTimeout(tryOnTimeout.current);
              setTryOnOpen(true);
            }}
            onMouseLeave={() => {
              tryOnTimeout.current = setTimeout(() => setTryOnOpen(false), 150);
            }}
          >
            <button
              type="button"
              className={`text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold whitespace-nowrap ${
                pathname === "/try-on" || pathname === "/identity-portrait"
                  ? "text-gold"
                  : "text-ivory-dim"
              }`}
            >
              {t.nav.tryOn}
            </button>
            {tryOnOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50">
                <div className="border border-ivory/10 bg-ink-deep/95 backdrop-blur-xl rounded-lg py-2 min-w-[180px] shadow-luxury">
                  {tryOnItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setTryOnOpen(false)}
                      className={`block px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-center transition-colors hover:text-gold hover:bg-gold/5 ${
                        pathname === item.href ? "text-gold" : "text-ivory-dim"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nav.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-[11px] uppercase tracking-[0.15em] transition-colors hover:text-gold whitespace-nowrap ${
                pathname === item.href ? "text-gold" : "text-ivory-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link
            href="/bag"
            aria-label="View bag"
            className="relative flex h-8 w-8 items-center justify-center text-ivory-dim transition-colors hover:text-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-ink-deep">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* User auth - right side */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold text-sm font-serif hover:border-gold/60 hover:bg-gold/20 transition-all"
                aria-label={t.auth.myProfile}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/25 text-[12px] tracking-[0.1em] text-gold hover:border-gold/50 hover:bg-gold/10 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t.auth.login}
              </button>
            )}

            {/* Dropdown: logged-in user menu */}
            {user && userMenuOpen && (
              <div className="absolute right-0 top-full mt-3 z-[100] w-[220px] rounded-lg border border-ivory/10 bg-ink-deep/95 backdrop-blur-xl py-2 shadow-luxury">
                <div className="px-5 py-3 border-b border-ivory/8">
                  <p className="text-[13px] text-ivory font-serif truncate">{user.name}</p>
                  <p className="text-[10px] text-ivory/35 truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-5 py-3 text-[12px] tracking-[0.08em] text-ivory/60 hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {t.auth.myProfile}
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setUserMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full text-left px-5 py-3 text-[12px] tracking-[0.08em] text-ivory/60 hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {t.auth.logout}
                </button>
              </div>
            )}

            {/* Dropdown: login form panel */}
            {!user && authOpen && (
              <LoginDropdown onClose={() => setAuthOpen(false)} />
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2.5 md:hidden">
          {user ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-serif"
              aria-label={t.auth.myProfile}
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex h-8 w-8 items-center justify-center text-ivory-dim"
              aria-label={t.auth.login}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
          <Link
            href="/bag"
            aria-label="View bag"
            className="relative flex h-8 w-8 items-center justify-center text-ivory-dim"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-ink-deep">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="h-px w-5 bg-ivory" />
            <span className="h-px w-5 bg-ivory" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-ivory/10 bg-ink-deep px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-ivory-soft"
              >
                {item.label}
              </Link>
            ))}
            <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/30 mt-2">
              {t.nav.tryOn}
            </p>
            {tryOnItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-ivory-soft pl-4"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/bag"
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest text-ivory-soft"
            >
              {t.nav.bag} {itemCount > 0 && `(${itemCount})`}
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-widest text-ivory-soft"
                >
                  {t.auth.myProfile}
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setOpen(false); }}
                  className="text-left text-sm uppercase tracking-widest text-ivory-soft"
                >
                  {t.auth.logout}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthOpen(true); setOpen(false); }}
                className="text-left text-sm uppercase tracking-widest text-ivory-soft"
              >
                {t.auth.login}
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

function LoginDropdown({ onClose }: { onClose: () => void }) {
  const { login, register } = useAuth();
  const { t } = useI18n();
  const a = t.auth;
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = mode === "login"
        ? await login(email, password)
        : await register(email, password, name);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error === "invalid_email" ? a.errorInvalidEmail : (result.error ?? a.errorGeneric));
      }
    } catch {
      setError(a.errorGeneric);
    }
    setLoading(false);
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-3 z-[100] w-[300px] rounded-lg border border-ivory/10 bg-ink-deep/95 backdrop-blur-xl shadow-luxury"
    >
      <div className="px-6 py-5">
        <p className="font-serif text-lg text-ivory mb-1">
          {mode === "login" ? a.loginTitle : a.registerTitle}
        </p>
        <p className="text-[10px] text-ivory/40 mb-5">
          {mode === "login" ? a.loginSubtitle : a.registerSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={a.namePlaceholder}
              className="w-full border border-ivory/12 bg-ivory/[0.03] rounded-md px-3.5 py-2.5 text-sm text-ivory placeholder-ivory/25 focus:border-gold/40 focus:outline-none transition-colors"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={a.emailPlaceholder}
            className="w-full border border-ivory/12 bg-ivory/[0.03] rounded-md px-3.5 py-2.5 text-sm text-ivory placeholder-ivory/25 focus:border-gold/40 focus:outline-none transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder={a.passwordPlaceholder}
            className="w-full border border-ivory/12 bg-ivory/[0.03] rounded-md px-3.5 py-2.5 text-sm text-ivory placeholder-ivory/25 focus:border-gold/40 focus:outline-none transition-colors"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-[11px] uppercase tracking-[0.2em] font-medium bg-gold/90 text-ink-deep hover:bg-gold transition-colors disabled:opacity-40"
          >
            {loading ? a.loading : mode === "login" ? a.loginButton : a.registerButton}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
          className="mt-4 w-full text-center text-[10px] text-ivory/35 hover:text-gold transition-colors"
        >
          {mode === "login" ? a.switchToRegister : a.switchToLogin}
        </button>
      </div>
    </div>
  );
}
