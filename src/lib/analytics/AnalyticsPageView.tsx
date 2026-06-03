"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "./tracker";

// Drop this component once inside the root layout to auto-track page views.
export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    track({ event_name: "page_view" });
  }, [pathname]);

  return null;
}
