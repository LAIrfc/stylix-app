"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { products } from "@/lib/data/products";
import type { Product } from "@/lib/types/product";
import { Button } from "@/components/ui/Button";
import { uploadImage } from "@/lib/utils/upload";

// ── MediaPipe landmark indices ────────────────────────────────────────────────
const RING_MCP = 13;
const RING_PIP = 14;
const INDEX_MCP = 5;
const PINKY_MCP = 17;

// ── Overlay defaults per category ────────────────────────────────────────────
const CATEGORY_DEFAULTS: Record<Product["category"], { x: number; y: number }> = {
  rings:     { x: 0.5, y: 0.82 },
  necklaces: { x: 0.5, y: 0.42 },
  earrings:  { x: 0.5, y: 0.30 },
  bracelets: { x: 0.5, y: 0.72 },
};

function ema(prev: number, next: number, alpha = 0.35): number {
  return prev + alpha * (next - prev);
}

// ── Styling context types ─────────────────────────────────────────────────────
type Occasion = "black-tie" | "date night" | "work" | "wedding guest" | "casual" | "editorial";
type Mood = "confident" | "dreamy" | "powerful" | "sensual" | "polished" | "playful";

const occasionLabels: Record<Occasion, string> = {
  "black-tie": "Black-Tie", "date night": "Date Night", work: "Professional",
  "wedding guest": "Wedding Guest", casual: "Casual", editorial: "Editorial",
};
const moodLabels: Record<Mood, string> = {
  confident: "Confident", dreamy: "Dreamy", powerful: "Powerful",
  sensual: "Sensual", polished: "Polished", playful: "Playful",
};

function getAICommentary(product: Product, occasion: Occasion | null, mood: Mood | null): string {
  if (!occasion && !mood) return `${product.name} — select an occasion and mood for a personalised styling note.`;
  const oNote = occasion ? `for ${occasionLabels[occasion].toLowerCase()}` : "";
  const mNote = mood ? `carrying a ${moodLabels[mood].toLowerCase()} energy` : "";
  const join = oNote && mNote ? ", " : "";
  if (product.tags.collectionCategory === "designer-capsule") {
    return `${product.name} — curated from the ${product.collaboratorName ?? "designer"} capsule${oNote ? ` ${oNote}` : ""}${join}${mNote}. Selected by Stylix for your profile.`;
  }
  const sym = product.symbolism ? ` ${product.symbolism.split("—")[0].trim()}.` : "";
  return `${product.name}${oNote ? ` — selected ${oNote}` : ""}${join}${mNote}.${sym} Balanced for your silhouette.`;
}

// ── Draw overlay on canvas ────────────────────────────────────────────────────
function drawOverlay(
  ctx: CanvasRenderingContext2D,
  overlayImg: HTMLImageElement | null,
  cx: number, cy: number,
  sizePx: number,
  rotateDeg: number,
  opacity: number,
  category: Product["category"],
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(cx, cy);
  ctx.rotate((rotateDeg * Math.PI) / 180);

  if (overlayImg) {
    ctx.drawImage(overlayImg, -sizePx / 2, -sizePx / 2, sizePx, sizePx);
  } else {
    // Fallback: draw a gold guide shape
    ctx.strokeStyle = "rgba(201,169,98,0.9)";
    ctx.lineWidth = 3;
    if (category === "necklaces") {
      // Arc for necklace
      ctx.beginPath();
      ctx.arc(0, 0, sizePx * 0.45, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();
      // Pendant
      ctx.beginPath();
      ctx.arc(0, sizePx * 0.45, sizePx * 0.1, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Ring ellipse
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.ellipse(0, 0, sizePx * 0.42, sizePx * 0.46, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(201,169,98,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, sizePx * 0.22, sizePx * 0.24, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

// ── Main component ────────────────────────────────────────────────────────────

export function TryOnClient() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("piece");

  const [selected, setSelected] = useState<Product>(() => {
    const found = initialSlug ? products.find((p) => p.slug === initialSlug) : undefined;
    return found ?? products[0];
  });

  const [mode, setMode] = useState<"upload" | "webcam">("upload");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [trackingActive, setTrackingActive] = useState(false);

  // Overlay controls
  const [overlayX, setOverlayX] = useState(0.5);
  const [overlayY, setOverlayY] = useState(0.5);
  const [overlayScale, setOverlayScale] = useState(0.22);
  const [overlayRotate, setOverlayRotate] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.92);

  const overlayXRef = useRef(overlayX);
  const overlayYRef = useRef(overlayY);
  const overlayScaleRef = useRef(overlayScale);
  const overlayRotateRef = useRef(overlayRotate);
  const overlayOpacityRef = useRef(overlayOpacity);
  useEffect(() => { overlayXRef.current = overlayX; }, [overlayX]);
  useEffect(() => { overlayYRef.current = overlayY; }, [overlayY]);
  useEffect(() => { overlayScaleRef.current = overlayScale; }, [overlayScale]);
  useEffect(() => { overlayRotateRef.current = overlayRotate; }, [overlayRotate]);
  useEffect(() => { overlayOpacityRef.current = overlayOpacity; }, [overlayOpacity]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const overlayImgRef = useRef<HTMLImageElement | null>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const handLandmarkerRef = useRef<any>(null);
  const smoothAnchor = useRef<{ x: number; y: number; sz: number } | null>(null);
  const selectedRef = useRef(selected);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  // Reset overlay position when product changes
  useEffect(() => {
    const def = CATEGORY_DEFAULTS[selected.category];
    setOverlayX(def.x);
    setOverlayY(def.y);
    setOverlayScale(selected.category === "necklaces" ? 0.35 : 0.22);
    setOverlayRotate(0);
    smoothAnchor.current = null;
    setTrackingActive(false);
  }, [selected]);

  // Load overlay image — use coverImage as fallback since tryOnAsset may not exist
  useEffect(() => {
    overlayImgRef.current = null;
    const src = selected.tryOnAsset ?? selected.coverImage;
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { overlayImgRef.current = img; };
    img.src = src;
  }, [selected]);

  // ── MediaPipe (optional, graceful fallback) ───────────────────────────────
  const loadMediaPipe = useCallback(async () => {
    if (handLandmarkerRef.current) return;
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const fs = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm"
      );
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(fs, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
    } catch {
      // Tracking unavailable — manual mode works fine
    }
  }, []);

  // ── Draw loop (webcam) ────────────────────────────────────────────────────
  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(drawLoop);
      return;
    }
    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    const cur = selectedRef.current;
    let tracked = false;

    // Try tracking for rings
    if (handLandmarkerRef.current && cur.category === "rings") {
      try {
        const res = handLandmarkerRef.current.detectForVideo(video, performance.now());
        if (res.landmarks?.length > 0) {
          const lm = res.landmarks[0];
          const mcp = lm[RING_MCP];
          const pip = lm[RING_PIP];
          const iMcp = lm[INDEX_MCP];
          const pMcp = lm[PINKY_MCP];
          const cx = (mcp.x * 0.75 + pip.x * 0.25) * w;
          const cy = (mcp.y * 0.75 + pip.y * 0.25) * h;
          const span = Math.hypot((iMcp.x - pMcp.x) * w, (iMcp.y - pMcp.y) * h);
          const sz = span * 0.52;
          if (!smoothAnchor.current) {
            smoothAnchor.current = { x: cx, y: cy, sz };
          } else {
            smoothAnchor.current.x = ema(smoothAnchor.current.x, cx);
            smoothAnchor.current.y = ema(smoothAnchor.current.y, cy);
            smoothAnchor.current.sz = ema(smoothAnchor.current.sz, sz);
          }
          const angle = Math.atan2((pip.y - mcp.y) * h, (pip.x - mcp.x) * w) - Math.PI / 2;
          drawOverlay(ctx, overlayImgRef.current, smoothAnchor.current.x, smoothAnchor.current.y,
            smoothAnchor.current.sz, (angle * 180) / Math.PI, overlayOpacityRef.current, cur.category);
          setTrackingActive(true);
          tracked = true;
        } else {
          smoothAnchor.current = null;
          setTrackingActive(false);
        }
      } catch { /* frame skip */ }
    }

    if (!tracked) {
      setTrackingActive(false);
      drawOverlay(
        ctx, overlayImgRef.current,
        overlayXRef.current * w, overlayYRef.current * h,
        overlayScaleRef.current * w,
        overlayRotateRef.current,
        overlayOpacityRef.current,
        cur.category,
      );
    }

    rafRef.current = requestAnimationFrame(drawLoop);
  }, []);

  // ── Webcam lifecycle ──────────────────────────────────────────────────────
  const stopWebcam = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setWebcamReady(false);
    setTrackingActive(false);
  }, []);

  useEffect(() => {
    if (mode !== "webcam") return;

    setWebcamError(null);
    setWebcamReady(false);
    let active = true;

    async function startCamera() {
      // Guard: must be client-side with mediaDevices API
      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        console.warn("[TryOn] mediaDevices unavailable");
        if (active) setWebcamError("Camera API unavailable on this browser or connection.");
        return;
      }

      console.log("[TryOn] requesting camera");
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        console.log("[TryOn] camera granted");
      } catch (err) {
        console.error("[TryOn] camera denied", err);
        if (active) setWebcamError((err as Error).message ?? "Camera access denied.");
        return;
      }

      if (!active) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;

      // Wait for metadata before calling play()
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) { resolve(); return; }
        video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      });

      if (!active) return;

      try {
        await video.play();
        console.log("[TryOn] video playing", video.videoWidth, "x", video.videoHeight);
      } catch (err) {
        console.error("[TryOn] video.play() failed", err);
        if (active) setWebcamError("Could not start video playback.");
        return;
      }

      if (!active) return;
      setWebcamReady(true);
      loadMediaPipe();
      rafRef.current = requestAnimationFrame(drawLoop);
    }

    startCamera();

    return () => {
      active = false;
      stopWebcam();
    };
  }, [mode, drawLoop, stopWebcam, loadMediaPipe]);

  // ── Upload photo ──────────────────────────────────────────────────────────
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadError(null);
    setUploading(true);
    const localUrl = URL.createObjectURL(f);
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return localUrl; });
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      photoImgRef.current = img;
      renderPhoto(img);
    };
    img.src = localUrl;
    uploadImage(f).then((res) => {
      setUploading(false);
      if (!res.ok) setUploadError(res.error.message);
    });
  }

  function renderPhoto(img: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    drawOverlay(
      ctx, overlayImgRef.current,
      overlayXRef.current * img.naturalWidth,
      overlayYRef.current * img.naturalHeight,
      overlayScaleRef.current * img.naturalWidth,
      overlayRotateRef.current,
      overlayOpacityRef.current,
      selectedRef.current.category,
    );
  }

  // Re-render photo when overlay controls change
  useEffect(() => {
    if (mode === "upload" && photoImgRef.current) renderPhoto(photoImgRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayX, overlayY, overlayScale, overlayRotate, overlayOpacity, selected, mode]);

  function resetUpload() {
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setUploadError(null);
    setUploading(false);
    photoImgRef.current = null;
    const c = canvasRef.current;
    if (c) { const ctx = c.getContext("2d"); ctx?.clearRect(0, 0, c.width, c.height); }
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `stylix-preview-${selected.slug}.png`;
    a.click();
  }

  const aiCommentary = getAICommentary(selected, occasion, mood);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">

        {/* ── Left panel ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Styling context */}
          <div className="border border-ivory/10 bg-ink-soft/30">
            <button type="button" onClick={() => setPanelOpen((v) => !v)}
              className="flex w-full items-center justify-between px-6 py-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">Styling Context</p>
              <span className="text-ivory/30 text-xs">{panelOpen ? "−" : "+"}</span>
            </button>
            {panelOpen && (
              <div className="border-t border-ivory/8 px-6 pb-6 pt-5 space-y-5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Occasion</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(occasionLabels) as Occasion[]).map((o) => (
                      <button key={o} type="button" onClick={() => setOccasion(occasion === o ? null : o)}
                        className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${
                          occasion === o ? "border-gold/60 bg-gold/8 text-gold" : "border-ivory/10 text-ivory/40 hover:border-ivory/25 hover:text-ivory/60"
                        }`}>
                        {occasionLabels[o]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Mood</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(moodLabels) as Mood[]).map((m) => (
                      <button key={m} type="button" onClick={() => setMood(mood === m ? null : m)}
                        className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${
                          mood === m ? "border-gold/60 bg-gold/8 text-gold" : "border-ivory/10 text-ivory/40 hover:border-ivory/25 hover:text-ivory/60"
                        }`}>
                        {moodLabels[m]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI commentary */}
          <div className="border border-gold/15 bg-gold/4 px-6 py-5">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60 mb-3">Stylix · Styling Note</p>
            <p className="text-sm leading-relaxed text-ivory/75 font-serif italic">&ldquo;{aiCommentary}&rdquo;</p>
            {selected.tags.collectionCategory === "designer-capsule" && selected.collaboratorName && (
              <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-gold/40">
                {selected.collaboratorName} · Curated Designer Capsule
              </p>
            )}
          </div>

          {/* Mode toggle */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Input Mode</p>
            <div className="flex border border-ivory/15">
              {(["upload", "webcam"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    mode === m ? "bg-gold/10 text-gold" : "text-ivory/40 hover:text-ivory/60"
                  }`}>
                  {m === "upload" ? "Photo Upload" : "Live Camera"}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          {mode === "upload" && (
            <div>
              <label className="flex flex-col items-center justify-center border border-dashed border-ivory/15 px-6 py-8 cursor-pointer hover:border-gold/30 transition-colors">
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/30 mb-1">Drag & drop or click</span>
                <span className="text-[9px] text-ivory/20">JPG · PNG · WEBP</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="sr-only" />
              </label>
              {uploading && <p className="mt-2 text-xs text-ivory/40 animate-pulse">Uploading…</p>}
              {uploadError && <p className="mt-2 text-xs text-red-400">{uploadError}</p>}
            </div>
          )}

          {/* Webcam status */}
          {mode === "webcam" && (
            <div className="border border-ivory/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${webcamReady ? "bg-gold" : "bg-ivory/20"}`} />
                <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/50">
                  {webcamError ? "Camera unavailable" : webcamReady
                    ? trackingActive ? "Tracking-assisted placement" : "Manual placement"
                    : "Requesting camera…"}
                </p>
              </div>
              {webcamError && <p className="mt-2 text-xs text-red-400">{webcamError}</p>}
              {webcamReady && (
                <p className="mt-1 text-[9px] text-ivory/25">
                  {trackingActive ? "Ring anchored to finger · adjust below if needed" : "Tracking-assisted, manually adjustable"}
                </p>
              )}
            </div>
          )}

          {/* Piece selector */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Jewelry Piece</p>
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {products.map((p) => {
                const isDesigner = p.tags.collectionCategory === "designer-capsule";
                return (
                  <button key={p.id} type="button" onClick={() => setSelected(p)}
                    className={`flex w-full items-center gap-3 border p-2 text-left transition-colors ${
                      selected.id === p.id ? "border-gold/40 bg-gold/5" : "border-ivory/8 hover:border-ivory/20"
                    }`}>
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-stone-900">
                      <Image src={p.coverImage} alt="" fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm text-ivory truncate">{p.name}</p>
                      <p className="text-[9px] uppercase tracking-wider text-ivory/30 truncate">
                        {isDesigner && p.collaboratorName ? p.collaboratorName : p.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overlay controls */}
          <div className="border border-ivory/10 px-5 py-5 space-y-4">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60">Adjust Placement</p>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Move X</label>
                <span className="text-[9px] text-ivory/30">{Math.round(overlayX * 100)}%</span>
              </div>
              <input type="range" min={5} max={95} value={Math.round(overlayX * 100)}
                onChange={(e) => setOverlayX(Number(e.target.value) / 100)}
                className="w-full accent-[#C9A962]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Move Y</label>
                <span className="text-[9px] text-ivory/30">{Math.round(overlayY * 100)}%</span>
              </div>
              <input type="range" min={5} max={95} value={Math.round(overlayY * 100)}
                onChange={(e) => setOverlayY(Number(e.target.value) / 100)}
                className="w-full accent-[#C9A962]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Scale</label>
                <span className="text-[9px] text-ivory/30">{Math.round(overlayScale * 100)}%</span>
              </div>
              <input type="range" min={5} max={70} value={Math.round(overlayScale * 100)}
                onChange={(e) => setOverlayScale(Number(e.target.value) / 100)}
                className="w-full accent-[#C9A962]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Rotate</label>
                <span className="text-[9px] text-ivory/30">{overlayRotate}°</span>
              </div>
              <input type="range" min={-180} max={180} value={overlayRotate}
                onChange={(e) => setOverlayRotate(Number(e.target.value))}
                className="w-full accent-[#C9A962]" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Opacity</label>
                <span className="text-[9px] text-ivory/30">{Math.round(overlayOpacity * 100)}%</span>
              </div>
              <input type="range" min={10} max={100} value={Math.round(overlayOpacity * 100)}
                onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
                className="w-full accent-[#C9A962]" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={download}>Save Preview</Button>
            <Button type="button" variant="outline"
              onClick={mode === "upload" ? resetUpload : stopWebcam}>
              {mode === "upload" ? "Clear" : "Stop Camera"}
            </Button>
          </div>

          {/* 3D Atelier upsell */}
          <div className="border border-gold/15 bg-gold/4 px-5 py-5">
            <p className="text-[9px] uppercase tracking-[0.35em] text-gold/60 mb-2">Private Atelier · Coming Soon</p>
            <p className="font-serif text-sm text-ivory/70 mb-1">3D Atelier Try-On</p>
            <p className="text-xs leading-relaxed text-ivory/35">
              Real-time 3D ring rendering anchored to your hand — Private Atelier Access only.
            </p>
            <p className="mt-2 text-[9px] text-ivory/25">
              Available for VIP clients and verified purchases.
            </p>
            <Link href="/vip"
              className="mt-4 inline-flex text-[9px] uppercase tracking-[0.3em] text-gold/60 hover:text-gold transition-colors">
              Apply for Private Atelier →
            </Link>
          </div>

          {/* Advisor CTA */}
          <div className="border-t border-ivory/8 pt-4">
            <Link href="/advisor"
              className="text-[10px] uppercase tracking-[0.3em] text-gold/60 hover:text-gold transition-colors">
              Start AI Styling →
            </Link>
          </div>
        </div>

        {/* ── Right: canvas ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="relative min-h-[520px] border border-ivory/10 bg-ink-soft/20">
            {mode === "upload" && !photoUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/15">Virtual Styling Preview</p>
                <p className="font-serif text-2xl text-ivory/10">Upload a photo to begin</p>
                <p className="text-xs text-ivory/15 max-w-xs">
                  Upload a portrait or outfit photo — the jewelry overlay will appear automatically.
                </p>
              </div>
            )}
            {mode === "webcam" && !webcamReady && !webcamError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/25 animate-pulse">
                  Initialising camera…
                </p>
              </div>
            )}

            <video ref={videoRef} playsInline muted className="hidden" aria-hidden="true" />
            <canvas
              ref={canvasRef}
              className="mx-auto max-h-[80vh] w-full object-contain"
            />

            {/* Active piece label */}
            {((mode === "webcam" && webcamReady) || (mode === "upload" && photoUrl)) && (
              <div className="absolute top-4 right-4 border border-ivory/10 bg-ink-deep/80 backdrop-blur-sm px-3 py-2">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">{selected.name}</p>
                {trackingActive && (
                  <p className="text-[8px] text-ivory/25 mt-0.5">Tracking active</p>
                )}
              </div>
            )}
          </div>

          {/* Status bar */}
          <p className="text-xs text-ivory/25">
            Virtual Styling Preview · {selected.name} ·{" "}
            {trackingActive ? "tracking-assisted placement" : "manually adjustable"} ·{" "}
            {mode === "upload" ? "photo mode" : "live camera"}
          </p>
        </div>
      </div>
    </div>
  );
}
