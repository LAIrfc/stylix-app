"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOrder, type OrderSummary } from "@/lib/order/OrderContext";

const COUNTRY_LABELS: Record<string, string> = { US: "United States", CA: "Canada" };
const PAYMENT_LABELS: Record<string, string> = {
  card: "Credit / Debit Card",
  "apple-pay": "Apple Pay",
  paypal: "PayPal",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function OrderDetails({ order }: { order: OrderSummary }) {
  return (
    <div className="mt-14 w-full max-w-2xl mx-auto text-left space-y-10">

      {/* Order ID + date */}
      <div className="border border-ivory/10 bg-ink-soft/20 px-7 py-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-1">Order</p>
            <p className="font-serif text-sm text-ivory">{order.orderId}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-1">Placed</p>
            <p className="text-sm text-ivory/70">{formatDate(order.placedAt)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-1">Payment</p>
            <p className="text-sm text-ivory/70">{PAYMENT_LABELS[order.paymentMethod]}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-gold/60 mb-5">Your Pieces</p>
        <div className="space-y-4">
          {order.items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-5 border border-ivory/8 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-ivory/10 bg-ink-soft">
                <Image
                  src={product.coverImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 items-start justify-between gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="font-serif text-base text-ivory">{product.name}</p>
                  <p className="text-[10px] text-ivory/40 mt-0.5">{product.subtitle}</p>
                  <p className="text-[9px] uppercase tracking-wider text-ivory/25 mt-1">{product.material}</p>
                  {quantity > 1 && (
                    <p className="text-[9px] text-ivory/30 mt-1">Qty: {quantity}</p>
                  )}
                </div>
                <p className="shrink-0 font-serif text-base text-ivory">
                  ${(product.price * quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border border-ivory/10 bg-ink-soft/20 px-7 py-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ivory/50">Subtotal</span>
          <span className="text-ivory">${order.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ivory/50">Shipping</span>
          <span className={order.shippingFree ? "text-gold/70" : "text-ivory/50"}>
            {order.shippingFree ? "Complimentary" : "Calculated"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ivory/50">Estimated Tax</span>
          <span className="text-ivory/50">${order.estimatedTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-ivory/10 pt-3">
          <span className="font-serif text-base text-ivory">Total</span>
          <span className="font-serif text-base text-ivory">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-gold/60 mb-3">Shipping To</p>
          <div className="text-sm text-ivory/60 space-y-0.5">
            <p className="text-ivory">{order.contact.firstName} {order.contact.lastName}</p>
            <p>{order.shipping.address1}</p>
            {order.shipping.address2 && <p>{order.shipping.address2}</p>}
            <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
            <p>{COUNTRY_LABELS[order.shipping.country] ?? order.shipping.country}</p>
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-gold/60 mb-3">Confirmation Sent To</p>
          <p className="text-sm text-ivory/60">{order.contact.email}</p>
          <p className="mt-4 text-[9px] text-ivory/25 leading-relaxed">
            Your pieces will be prepared with care and dispatched within 2–3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const { order } = useOrder();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-8 bg-gold/40" />
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">
              Stylix · Order Confirmed
            </p>
            <span className="h-px w-8 bg-gold/40" />
          </div>

          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Thank you.</h1>

          <p className="mt-6 text-sm leading-relaxed text-ivory/60 max-w-sm mx-auto">
            Your order has been received and will be prepared with care.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              "Complimentary gift packaging included",
              "Free returns within 14 days",
              "Questions? Contact your Stylix concierge",
            ].map((line) => (
              <p key={line} className="flex items-center gap-2 text-[10px] text-ivory/30">
                <span className="h-px w-4 bg-gold/30 shrink-0" />
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Order details — only shown when order context is available */}
        {mounted && order && <OrderDetails order={order} />}

        {/* CTAs */}
        <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/collection"
            className="inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium border border-gold/30 text-gold hover:border-gold transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/advisor"
            className="text-[10px] uppercase tracking-[0.3em] text-ivory/30 hover:text-gold transition-colors"
          >
            Start AI Styling →
          </Link>
        </div>
      </div>
    </div>
  );
}
