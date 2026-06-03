"use client";

import { useCallback } from "react";
import { track, type TrackEventOptions } from "./tracker";

export function useAnalytics() {
  const trackEvent = useCallback((opts: TrackEventOptions) => {
    track(opts);
  }, []);

  return { track: trackEvent };
}
