"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

export function ProductPageTracker({ productId }: { productId: string }) {
  useEffect(() => {
    track({ event_name: EVENTS.PRODUCT_VIEW, product_id: productId });
  }, [productId]);

  return null;
}
