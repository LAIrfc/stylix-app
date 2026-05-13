import { NextRequest, NextResponse } from "next/server";

// ── Stripe server-side route ──────────────────────────────────────────────────
// To go live: set STRIPE_SECRET_KEY in .env.local and uncomment the Stripe SDK
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

interface LineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, successUrl, cancelUrl } = (await req.json()) as {
      items: LineItem[];
      successUrl: string;
      cancelUrl: string;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // ── MOCK SESSION (development / no Stripe key) ────────────────────────────
    // Replace this block with real Stripe session creation once keys are set.
    if (!process.env.STRIPE_SECRET_KEY) {
      const mockSessionId = `mock_cs_${Date.now()}`;
      return NextResponse.json({
        sessionId: mockSessionId,
        url: `${successUrl}?session_id=${mockSessionId}&mock=true`,
        mock: true,
      });
    }

    // ── LIVE STRIPE SESSION ───────────────────────────────────────────────────
    // Uncomment when STRIPE_SECRET_KEY is set:
    //
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card", "apple_pay"],
    //   line_items: items.map((item) => ({
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: item.name,
    //         images: item.image ? [item.image] : [],
    //       },
    //       unit_amount: Math.round(item.price * 100),
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: "payment",
    //   success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: cancelUrl,
    //   shipping_address_collection: { allowed_countries: ["US", "CA"] },
    //   automatic_tax: { enabled: true },
    //   allow_promotion_codes: true,
    // });
    // return NextResponse.json({ sessionId: session.id, url: session.url });

    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  } catch (err) {
    console.error("[checkout/api]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
