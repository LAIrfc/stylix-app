import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SHIPPING_THRESHOLD = 500;
const TAX_RATE = 0.08875;

interface LineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface ShippingInfo {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CheckoutRequest {
  items: LineItem[];
  contact: ContactInfo;
  shipping: ShippingInfo;
  successUrl: string;
  cancelUrl: string;
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `STX-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("[checkout] STRIPE_SECRET_KEY is not set");
    return NextResponse.json({ error: "Checkout unavailable." }, { status: 503 });
  }

  let body: CheckoutRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { items, contact, shipping, successUrl, cancelUrl } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "No items provided." }, { status: 400 });
  }
  if (!contact?.email || !contact.firstName || !contact.lastName) {
    return NextResponse.json({ error: "Contact information incomplete." }, { status: 400 });
  }
  if (!shipping?.address1 || !shipping.city || !shipping.state || !shipping.zip) {
    return NextResponse.json({ error: "Shipping address incomplete." }, { status: 400 });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFree = subtotal >= SHIPPING_THRESHOLD;
  const taxCents = Math.round(subtotal * TAX_RATE * 100);
  const subtotalCents = Math.round(subtotal * 100);
  const orderId = generateOrderId();

  const metadata: Record<string, string> = {
    order_id: orderId,
    contact_email: contact.email,
    contact_first: contact.firstName,
    contact_last: contact.lastName,
    contact_phone: contact.phone ?? "",
    shipping_address1: shipping.address1,
    shipping_address2: shipping.address2 ?? "",
    shipping_city: shipping.city,
    shipping_state: shipping.state,
    shipping_zip: shipping.zip,
    shipping_country: shipping.country ?? "US",
    shipping_free: String(shippingFree),
    subtotal_cents: String(subtotalCents),
    tax_cents: String(taxCents),
    items_json: JSON.stringify(
      items.map((i) => ({ id: i.productId, name: i.name, price: i.price, qty: i.quantity }))
    ),
  };

  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "link"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: contact.email,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: shippingFree ? "Complimentary Shipping" : "Standard Shipping",
          },
        },
      ],
      allow_promotion_codes: true,
      metadata,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe session creation failed", err);
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}
