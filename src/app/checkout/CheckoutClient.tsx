"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

const ESTIMATED_TAX_RATE = 0.08875;
const SHIPPING_THRESHOLD = 500;

function Field({
  label,
  id,
  type = "text",
  autoComplete,
  required = true,
  half = false,
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  half?: boolean;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label htmlFor={id} className="block text-[9px] uppercase tracking-[0.3em] text-ivory/40 mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full border border-ivory/15 bg-transparent px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:border-gold/50 focus:outline-none transition-colors"
      />
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-deep/95 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-8">
        <span className="h-px w-8 bg-gold/40" />
        <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">Stylix · Secure Checkout</p>
        <span className="h-px w-8 bg-gold/40" />
      </div>
      <p className="font-serif text-3xl text-ivory mb-6">Redirecting to secure payment…</p>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-gold/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-ivory/20">
        Please do not close this window
      </p>
    </div>
  );
}

export function CheckoutClient() {
  const { items, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFree = subtotal >= SHIPPING_THRESHOLD;
  const estimatedTax = subtotal * ESTIMATED_TAX_RATE;
  const estimatedTotal = subtotal + estimatedTax;

  useEffect(() => {
    if (items.length > 0) {
      track({ event_name: EVENTS.CHECKOUT_START });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-32 lg:px-10 text-center">
        <p className="font-serif text-2xl text-ivory/30">Your bag is empty.</p>
        <Link
          href="/collection"
          className="mt-10 inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium border border-gold/30 text-gold hover:border-gold transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    track({ event_name: EVENTS.CHECKOUT_SUBMIT });

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value ?? "";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          contact: {
            firstName: get("firstName"),
            lastName: get("lastName"),
            email: get("email"),
            phone: get("phone") || undefined,
          },
          shipping: {
            address1: get("address1"),
            address2: get("address2") || undefined,
            city: get("city"),
            state: get("state"),
            zip: get("zip"),
            country: get("country"),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {submitting && <LoadingOverlay />}

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

            {/* ── Left: form ─────────────────────────────────────────────── */}
            <div className="space-y-12">

              {/* Contact */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-6">
                  Contact Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" id="firstName" autoComplete="given-name" half />
                  <Field label="Last Name" id="lastName" autoComplete="family-name" half />
                  <Field label="Email Address" id="email" type="email" autoComplete="email" />
                  <Field label="Phone (optional)" id="phone" type="tel" autoComplete="tel" required={false} />
                </div>
              </section>

              {/* Shipping */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-6">
                  Shipping Address
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Address Line 1" id="address1" autoComplete="address-line1" />
                  <Field label="Address Line 2 (optional)" id="address2" autoComplete="address-line2" required={false} />
                  <Field label="City" id="city" autoComplete="address-level2" half />
                  <Field label="State / Province" id="state" autoComplete="address-level1" half />
                  <Field label="ZIP / Postal Code" id="zip" autoComplete="postal-code" half />
                  <div className="col-span-1">
                    <label htmlFor="country" className="block text-[9px] uppercase tracking-[0.3em] text-ivory/40 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      defaultValue="US"
                      className="w-full border border-ivory/15 bg-ink-deep px-4 py-3 text-sm text-ivory focus:border-gold/50 focus:outline-none transition-colors"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment note */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-4">
                  Payment
                </p>
                <div className="border border-ivory/10 bg-ink-soft/20 px-6 py-5">
                  <p className="text-sm text-ivory/60 mb-1">
                    You will be redirected to Stripe&apos;s secure checkout to complete payment.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {["Credit Card", "Apple Pay", "Google Pay", "Link"].map((method) => (
                      <span
                        key={method}
                        className="border border-ivory/10 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-ivory/30"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {error && (
                <p className="border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium bg-gold/90 text-ink-deep hover:bg-gold transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {submitting ? "Redirecting…" : `Continue to Payment · $${estimatedTotal.toFixed(2)}`}
              </button>

              <p className="text-[9px] text-ivory/20 text-center">
                By continuing you agree to our{" "}
                <Link href="#" className="underline hover:text-ivory/40">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="underline hover:text-ivory/40">Privacy Policy</Link>.
                Payment is processed securely by Stripe.
              </p>
            </div>

            {/* ── Right: order summary ────────────────────────────────────── */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="border border-ivory/10 bg-ink-soft/20 px-7 py-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-7">
                  Your Order
                </p>

                <div className="space-y-5 divide-y divide-ivory/8">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-4 pt-5 first:pt-0">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-ivory/10 bg-ink-soft">
                        <Image
                          src={product.coverImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-ink-deep">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-2 min-w-0">
                        <div className="min-w-0">
                          <p className="font-serif text-sm text-ivory truncate">{product.name}</p>
                          <p className="text-[9px] text-ivory/30 truncate">{product.subtitle}</p>
                        </div>
                        <p className="shrink-0 text-sm text-ivory">
                          ${(product.price * quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 space-y-3 border-t border-ivory/10 pt-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ivory/50">Subtotal</span>
                    <span className="text-ivory">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory/50">Shipping</span>
                    <span className={shippingFree ? "text-gold/70" : "text-ivory/50"}>
                      {shippingFree ? "Complimentary" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory/50">Estimated Tax</span>
                    <span className="text-ivory/50">${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-ivory/10 pt-5 flex justify-between">
                  <span className="font-serif text-base text-ivory">Estimated Total</span>
                  <span className="font-serif text-base text-ivory">${estimatedTotal.toFixed(2)}</span>
                </div>

                <div className="mt-8 space-y-2">
                  {[
                    "SSL encrypted · Powered by Stripe",
                    "Free returns within 14 days",
                    "Complimentary gift packaging",
                  ].map((line) => (
                    <p key={line} className="flex items-center gap-2 text-[9px] text-ivory/20">
                      <span className="h-px w-3 bg-gold/25 shrink-0" />
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-6 border-t border-ivory/8 pt-5">
                  <Link
                    href="/bag"
                    className="text-[9px] uppercase tracking-[0.25em] text-ivory/25 hover:text-gold transition-colors"
                  >
                    ← Edit Bag
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
