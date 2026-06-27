import { Suspense } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { DbOrder } from "@/lib/types/database";
import { SuccessView } from "./SuccessView";

export const metadata = { title: "Order Confirmed — Stylix" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let order: DbOrder | null = null;

  if (session_id?.startsWith("cs_")) {
    try {
      const db = getSupabaseAdmin();
      const { data } = await db
        .schema("public")
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session_id)
        .single();
      order = (data as DbOrder) ?? null;
    } catch {
      // Webhook may not have fired yet — SuccessView will poll
    }
  }

  return (
    <Suspense>
      <SuccessView order={order} sessionId={session_id ?? null} />
    </Suspense>
  );
}
