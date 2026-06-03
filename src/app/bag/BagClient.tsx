"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

const SHIPPING_THRESHOLD = 500;
const ESTIMATED_TAX_RATE = 0.08875; // NYC rate placeholder

export function BagClient() {
  const { items, subtotal, removeItem, setQuantity } = useCart();

  useEffect(() => {
    track({ event_name: EVENTS.CART_VIEW });
  }, []);

  const shippingFree = subtotal >= SHIPPING_THRESHOLD;
  const estimatedTax = subtotal * ESTIMATED_TAX_RATE;
  const estimatedTotal = subtotal + estimatedTax;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-32 lg:px-10 text-center">
        <p className="font-serif text-2xl text-ivory/30">Your bag is empty.</p>
        <p className="mt-4 text-sm text-ivory/20">
          Explore the collection and add pieces that speak to you.
        </p>
        <Link
          href="/collection"
          className="mt-10 inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium border border-gold/30 text-gold hover:border-gold transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">

        {/* ── Items ──────────────────────────────────────────────────── */}
        <div>
          <div className="space-y-0 divide-y divide-ivory/8">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-6 py-8">
                {/* Image */}
                <Link href={`/product/${product.slug}`} className="shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden border border-ivory/10 bg-ink-soft">
                    <Image
                      src={product.coverImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60 mb-1">
                          {product.tags.collectionCategory === "designer-capsule"
                            ? product.collaboratorName ?? "Designer Capsule"
                            : product.tags.collectionName}
                        </p>
                        <Link href={`/product/${product.slug}`}>
                          <p className="font-serif text-lg text-ivory hover:text-gold transition-colors">
                            {product.name}
                          </p>
                        </Link>
                        <p className="mt-0.5 text-sm text-ivory/40">{product.subtitle}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-ivory/30">
                          {product.material}
                        </p>
                      </div>
                      <p className="shrink-0 font-serif text-lg text-ivory">
                        ${(product.price * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity + remove */}
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center border border-ivory/15">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ivory/50 hover:text-ivory transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm text-ivory">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-ivory/50 hover:text-ivory transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-[10px] uppercase tracking-[0.2em] text-ivory/25 hover:text-ivory/60 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping */}
          <div className="mt-8 border-t border-ivory/8 pt-8">
            <Link
              href="/collection"
              className="text-[10px] uppercase tracking-[0.3em] text-gold/60 hover:text-gold transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Order summary ───────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="border border-ivory/10 bg-ink-soft/20 px-8 py-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70 mb-8">
              Order Summary
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ivory/60">Subtotal</span>
                <span className="text-ivory">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/60">Shipping</span>
                <span className={shippingFree ? "text-gold/80" : "text-ivory/60"}>
                  {shippingFree ? "Complimentary" : `Calculated at checkout`}
                </span>
              </div>
              {!shippingFree && (
                <p className="text-[10px] text-ivory/25">
                  Complimentary shipping on orders over ${SHIPPING_THRESHOLD.toLocaleString()}
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-ivory/60">Estimated Tax</span>
                <span className="text-ivory/60">${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-ivory/10 pt-6 flex justify-between">
              <span className="font-serif text-base text-ivory">Estimated Total</span>
              <span className="font-serif text-base text-ivory">${estimatedTotal.toFixed(2)}</span>
            </div>

            <p className="mt-2 text-[9px] text-ivory/20">
              Final tax and shipping calculated at checkout.
            </p>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="mt-8 flex w-full items-center justify-center px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-medium bg-gold/90 text-ink-deep hover:bg-gold transition-colors"
            >
              Proceed to Checkout
            </Link>

            {/* Apple Pay hint */}
            <div className="mt-4 flex items-center justify-center gap-2 border border-ivory/8 py-3">
              <svg width="30" height="14" viewBox="0 0 30 14" fill="currentColor" className="text-ivory/50" aria-hidden="true">
                <text x="0" y="11" fontSize="11" fontFamily="system-ui" fontWeight="600">Apple Pay</text>
              </svg>
              <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/30">available at checkout</span>
            </div>

            {/* PayPal hint */}
            <div className="mt-2 flex items-center justify-center gap-2 border border-ivory/8 py-3">
              <span className="text-[10px] font-medium text-[#003087]/60" style={{ fontStyle: "italic" }}>Pay</span>
              <span className="text-[10px] font-medium text-[#009cde]/60" style={{ fontStyle: "italic" }}>Pal</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/30">available at checkout</span>
            </div>

            {/* Trust signals */}
            <div className="mt-6 space-y-2">
              {[
                "Secure checkout · SSL encrypted",
                "Free returns within 14 days",
                "Complimentary gift packaging",
              ].map((line) => (
                <p key={line} className="flex items-center gap-2 text-[9px] text-ivory/25">
                  <span className="h-px w-3 bg-gold/30 shrink-0" />
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
