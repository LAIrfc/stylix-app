"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/tracker";
import { isValidGlbUrl } from "@/lib/utils/model3d";

interface Product3DViewerProps {
  modelUrl: string;
  productName: string;
  productId?: string;
}

type ModelViewerElement = HTMLElement;

export function Product3DViewer({
  modelUrl,
  productName,
  productId,
}: Product3DViewerProps) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const safeModelUrl = isValidGlbUrl(modelUrl) ? modelUrl.trim() : null;

  useEffect(() => {
    let mounted = true;

    import("@google/model-viewer")
      .then(() => {
        if (mounted) setModelViewerReady(true);
      })
      .catch((err) => {
        console.error("[Product3DViewer] Failed to load model-viewer", err);
        if (mounted) setLoadError("3D viewer failed to load.");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setLoaded(false);
    setLoadError(null);
    setProgress(0);
  }, [safeModelUrl]);

  useEffect(() => {
    if (!safeModelUrl || trackedRef.current) return;
    trackedRef.current = true;
    track({ event_name: EVENTS.VIEW_3D_OPEN, product_id: productId });
  }, [safeModelUrl, productId]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !safeModelUrl) return;

    const attributes: Record<string, string> = {
      src: safeModelUrl,
      alt: `${productName} 3D model`,
      "auto-rotate-delay": "1200",
      "rotation-per-second": "24deg",
      "touch-action": "pan-y",
      "interaction-prompt": "auto",
      "shadow-intensity": "0.85",
      "shadow-softness": "0.8",
      exposure: "1.05",
      "environment-image": "neutral",
      "camera-orbit": "0deg 72deg 105%",
      "min-camera-orbit": "auto auto 55%",
      "max-camera-orbit": "auto auto 220%",
      "field-of-view": "30deg",
      loading: "eager",
      reveal: "auto",
    };

    modelViewer.setAttribute("camera-controls", "");
    modelViewer.setAttribute("auto-rotate", "");
    for (const [key, value] of Object.entries(attributes)) {
      modelViewer.setAttribute(key, value);
    }

    const handleLoad = () => {
      setLoaded(true);
      setProgress(1);
    };
    const handleError = (event: Event) => {
      console.error("[Product3DViewer] Failed to load model", { modelUrl: safeModelUrl, event });
      setLoadError("3D model unavailable.");
    };
    const handleProgress = (event: Event) => {
      const totalProgress = (event as CustomEvent<{ totalProgress?: number }>).detail?.totalProgress;
      if (typeof totalProgress === "number") setProgress(totalProgress);
    };

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("error", handleError);
    modelViewer.addEventListener("progress", handleProgress);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("error", handleError);
      modelViewer.removeEventListener("progress", handleProgress);
    };
  }, [safeModelUrl, modelViewerReady, productName]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    const frame = frameRef.current;
    if (!frame) return;

    try {
      if (document.fullscreenElement === frame) {
        await document.exitFullscreen();
      } else {
        await frame.requestFullscreen();
      }
    } catch (err) {
      console.error("[Product3DViewer] Fullscreen failed", err);
    }
  }

  if (!safeModelUrl) return null;

  const loadingLabel = progress > 0 ? `${Math.round(progress * 100)}%` : "Loading";

  return (
    <div
      ref={frameRef}
      className="relative aspect-square w-full max-w-md overflow-hidden border border-ivory/10 bg-gradient-to-b from-ink-muted to-ink-deep"
      data-product-3d-frame
    >
      {modelViewerReady &&
        createElement("model-viewer", {
          ref: modelViewerRef,
          className: "h-full w-full",
          style: {
            background: "transparent",
            height: "100%",
            width: "100%",
          },
          "data-product-3d-viewer": true,
        })}

      {(!modelViewerReady || (!loaded && !loadError)) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-deep/40">
          <div className="h-10 w-10 animate-spin rounded-full border border-gold/20 border-t-gold/80" />
          <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40">{loadingLabel}</p>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink-deep/85 px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">{loadError}</p>
        </div>
      )}

      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-3 top-3 z-10 border border-ivory/15 bg-ink-deep/70 px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-ivory/60 backdrop-blur transition-colors hover:border-gold/40 hover:text-gold"
        aria-label={isFullscreen ? "Exit fullscreen 3D viewer" : "Open fullscreen 3D viewer"}
      >
        {isFullscreen ? "Exit" : "Full"}
      </button>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_56%,rgba(5,5,5,0.62)_100%)]" />
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[9px] uppercase tracking-[0.35em] text-ivory/30">
        360 view
      </p>
    </div>
  );
}
