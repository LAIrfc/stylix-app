import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const base =
  "inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-500";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-ink-soft",
  ghost: "text-gold-muted hover:text-gold",
  outline: "border border-ink/20 text-ink hover:bg-ink hover:text-ivory hover:border-ink",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  type = "button",
  children,
  variant = "primary",
  className = "",
  disabled,
  onClick,
}: {
  type?: "button" | "submit";
  children: ReactNode;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
