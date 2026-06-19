"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

// ── Product data ──────────────────────────────────────────────────────────────
const NECKLACE = {
  id: "aurora-necklace",
  name: "Twin Star Layering Necklace",
  productImage: "/tryon/aurora-necklace/product-front.jpg",
};

const NECKLACE_PNG = "/tryon/aurora-necklace/transparent.png";

// BlazePose 33-point landmark indices
const NOSE        = 0;
const LEFT_EAR    = 7;
const RIGHT_EAR   = 8;
const MOUTH_LEFT  = 9;
const MOUTH_RIGHT = 10;
const LEFT_SHOULDER  = 11;
const RIGHT_SHOULDER = 12;

// ── Trim transparent PNG margins ─────────────────────────────────────────────
// Returns a canvas cropped to the bounding box of non-transparent pixels.
// If the image is fully transparent, returns the original image unchanged.
function trimTransparent(img: HTMLImageElement): HTMLCanvasElement | HTMLImageElement {
  const tmp = document.createElement("canvas");
  tmp.width  = img.naturalWidth;
  tmp.height = img.naturalHeight;
  const ctx = tmp.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, tmp.width, tmp.height);
  const w = tmp.width, h = tmp.height;
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (minX > maxX || minY > maxY) return img; // fully transparent
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = cw; out.height = ch;
  out.getContext("2d")!.drawImage(tmp, minX, minY, cw, ch, 0, 0, cw, ch);
  return out;
}

// ── Main component ────────────────────────────────────────────────────────────

export function TryOnClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const necklaceImgRef = useRef<HTMLImageElement | null>(null);
  const necklaceTrimmedRef = useRef<HTMLCanvasElement | HTMLImageElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    track({ event_name: EVENTS.TRYON_START, tool_name: "virtual-try-on" });
  }, []);

  // Store raw landmarks for debug overlay
  const landmarksRef = useRef<{ x: number; y: number }[] | null>(null);
  // Computed debug points (normalized 0–1)
  const debugPointsRef = useRef<{
    nose: { x: number; y: number };
    chin: { x: number; y: number };
    lShoulder: { x: number; y: number };
    rShoulder: { x: number; y: number };
    neckBase: { x: number; y: number };
    necklaceCenter: { x: number; y: number };
    necklaceLeft: { x: number; y: number };
    necklaceRight: { x: number; y: number };
  } | null>(null);

  // Overlay controls
  const [overlayX, setOverlayX] = useState(50);
  const [overlayY, setOverlayY] = useState(68);
  const [overlayScale, setOverlayScale] = useState(55);
  const [overlayRotate, setOverlayRotate] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(92);

  // Load necklace PNG and pre-trim transparent margins
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      necklaceImgRef.current = img;
      necklaceTrimmedRef.current = trimTransparent(img);
    };
    img.src = NECKLACE_PNG;
  }, []);

  // Lazily initialise PoseLandmarker
  async function getPoseLandmarker(): Promise<PoseLandmarker | null> {
    if (poseLandmarkerRef.current) return poseLandmarkerRef.current;
    try {
      const vision = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numPoses: 1,
      });
      poseLandmarkerRef.current = landmarker;
      return landmarker;
    } catch {
      return null;
    }
  }

  // Compute placement from pose landmarks and update sliders
  async function autoPlace(img: HTMLImageElement) {
    setDetecting(true);
    try {
      const landmarker = await getPoseLandmarker();
      if (!landmarker) return;

      const result = landmarker.detect(img);
      const lms = result.landmarks?.[0];
      if (!lms || lms.length < 13) return;

      const nose       = lms[NOSE];
      const lEar       = lms[LEFT_EAR];
      const rEar       = lms[RIGHT_EAR];
      const mouthL     = lms[MOUTH_LEFT];
      const mouthR     = lms[MOUTH_RIGHT];
      const lShoulder  = lms[LEFT_SHOULDER];
      const rShoulder  = lms[RIGHT_SHOULDER];

      // ── Neck base: midpoint between ears, pushed down toward shoulders ──
      // Ear midpoint gives the head-width center; interpolate 35% toward
      // shoulder midpoint to land at the clavicle/neck-base area.
      const earMidX = (lEar.x + rEar.x) / 2;
      const earMidY = (lEar.y + rEar.y) / 2;
      const shoulderMidX = (lShoulder.x + rShoulder.x) / 2;
      const shoulderMidY = (lShoulder.y + rShoulder.y) / 2;

      const neckBaseX = earMidX + (shoulderMidX - earMidX) * 0.35;
      const neckBaseY = earMidY + (shoulderMidY - earMidY) * 0.35;

      // ── X: use neck base, not raw shoulder midpoint ──
      setOverlayX(Math.round(neckBaseX * 100));

      // ── Scale: 32% of shoulder span, clamped to 28%–38% ──
      const shoulderSpanPct = Math.abs(lShoulder.x - rShoulder.x) * 100;
      const scale = Math.round(Math.max(shoulderSpanPct * 0.28, Math.min(shoulderSpanPct * 0.38, shoulderSpanPct * 0.32)));
      setOverlayScale(scale);

      // ── Y: neck base + small drop, pulled up by 8% of shoulder span ──
      const mouthMidY = (mouthL.y + mouthR.y) / 2;
      const chinY = mouthMidY + 0.04;
      const shoulderSpan = Math.abs(lShoulder.x - rShoulder.x);
      // raw drop from chin to collarbone, then subtract 8% of shoulder span to raise it
      const rawNecklaceY = chinY + 0.09 - shoulderSpan * 0.08;
      // Clamp: between neck base and 2% above shoulder midpoint
      const clampedY = Math.max(
        Math.min(rawNecklaceY, shoulderMidY - 0.02),
        neckBaseY,
      );
      setOverlayY(Math.round(clampedY * 100));

      // ── Rotation: shoulder tilt, clamped tightly ──
      const angleDeg =
        (Math.atan2(rShoulder.y - lShoulder.y, rShoulder.x - lShoulder.x) *
          180) /
        Math.PI;
      setOverlayRotate(Math.round(Math.max(-20, Math.min(20, angleDeg))));

      // ── Save debug points ──
      const mouthMidX = (mouthL.x + mouthR.x) / 2;
      const mouthMidY2 = (mouthL.y + mouthR.y) / 2;
      const chinY2 = mouthMidY2 + 0.04;
      const halfW = scale / 100 / 2;
      landmarksRef.current = lms.map((l) => ({ x: l.x, y: l.y }));
      debugPointsRef.current = {
        nose:          { x: nose.x,       y: nose.y },
        chin:          { x: mouthMidX,    y: chinY2 },
        lShoulder:     { x: lShoulder.x,  y: lShoulder.y },
        rShoulder:     { x: rShoulder.x,  y: rShoulder.y },
        neckBase:      { x: neckBaseX,    y: neckBaseY },
        necklaceCenter:{ x: neckBaseX,    y: clampedY },
        necklaceLeft:  { x: neckBaseX - halfW, y: clampedY },
        necklaceRight: { x: neckBaseX + halfW, y: clampedY },
      };

      // Suppress unused-variable warnings for nose (kept for future use)
      void nose;
    } finally {
      setDetecting(false);
    }
  }

  // Render canvas — high-DPI aware, no scaling blur
  function render() {
    const canvas = canvasRef.current;
    const img = photoImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    // Buffer at full native resolution × DPR for sharpness
    canvas.width  = naturalW * dpr;
    canvas.height = naturalH * dpr;
    // CSS size stays at natural pixels so layout is unchanged
    canvas.style.width  = `${naturalW}px`;
    canvas.style.height = `${naturalH}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, naturalW, naturalH);

    const necklaceImg = necklaceTrimmedRef.current ?? necklaceImgRef.current;
    if (necklaceImg) {
      const cx = (overlayX / 100) * naturalW;
      const cy = (overlayY / 100) * naturalH;
      const drawW = (overlayScale / 100) * naturalW;
      const srcW = necklaceImg instanceof HTMLCanvasElement ? necklaceImg.width  : necklaceImg.naturalWidth;
      const srcH = necklaceImg instanceof HTMLCanvasElement ? necklaceImg.height : necklaceImg.naturalHeight;
      const aspect = srcH / srcW;
      const drawH = drawW * aspect;

      ctx.save();
      ctx.globalAlpha = overlayOpacity / 100;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.translate(cx, cy);
      ctx.rotate((overlayRotate * Math.PI) / 180);
      ctx.drawImage(necklaceImg, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // ── Debug overlay ──────────────────────────────────────────────────────
    if (debugMode && debugPointsRef.current) {
      const dp = debugPointsRef.current;
      const r = Math.max(6, naturalW * 0.012); // dot radius scales with image
      const fontSize = Math.max(11, naturalW * 0.018);
      const c2d = ctx; // narrowed non-null reference for nested function

      function dot(x: number, y: number, color: string, label: string) {
        const px = x * naturalW;
        const py = y * naturalH;
        c2d.save();
        // outer ring
        c2d.beginPath();
        c2d.arc(px, py, r + 2, 0, Math.PI * 2);
        c2d.fillStyle = "rgba(0,0,0,0.55)";
        c2d.fill();
        // colored fill
        c2d.beginPath();
        c2d.arc(px, py, r, 0, Math.PI * 2);
        c2d.fillStyle = color;
        c2d.fill();
        // label
        c2d.font = `bold ${fontSize}px monospace`;
        c2d.fillStyle = "#fff";
        c2d.strokeStyle = "rgba(0,0,0,0.7)";
        c2d.lineWidth = 3;
        c2d.strokeText(label, px + r + 4, py + fontSize * 0.35);
        c2d.fillText(label, px + r + 4, py + fontSize * 0.35);
        c2d.restore();
      }

      // Necklace width line
      const lx = dp.necklaceLeft.x  * naturalW;
      const rx = dp.necklaceRight.x * naturalW;
      const ly = dp.necklaceLeft.y  * naturalH;
      const ry = dp.necklaceRight.y * naturalH;
      ctx.save();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = Math.max(2, naturalW * 0.004);
      ctx.setLineDash([Math.max(4, naturalW * 0.008), Math.max(4, naturalW * 0.008)]);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(rx, ry);
      ctx.stroke();
      ctx.restore();

      // Shoulder connector line
      ctx.save();
      ctx.strokeStyle = "rgba(251,146,60,0.6)";
      ctx.lineWidth = Math.max(1.5, naturalW * 0.003);
      ctx.setLineDash([Math.max(3, naturalW * 0.006), Math.max(3, naturalW * 0.006)]);
      ctx.beginPath();
      ctx.moveTo(dp.lShoulder.x * naturalW, dp.lShoulder.y * naturalH);
      ctx.lineTo(dp.rShoulder.x * naturalW, dp.rShoulder.y * naturalH);
      ctx.stroke();
      ctx.restore();

      // Neck drop line: neckBase → necklaceCenter
      ctx.save();
      ctx.strokeStyle = "rgba(167,243,208,0.7)";
      ctx.lineWidth = Math.max(1.5, naturalW * 0.003);
      ctx.setLineDash([Math.max(3, naturalW * 0.005), Math.max(3, naturalW * 0.005)]);
      ctx.beginPath();
      ctx.moveTo(dp.neckBase.x * naturalW, dp.neckBase.y * naturalH);
      ctx.lineTo(dp.necklaceCenter.x * naturalW, dp.necklaceCenter.y * naturalH);
      ctx.stroke();
      ctx.restore();

      // Dots (drawn last so they sit on top of lines)
      dot(dp.nose.x,           dp.nose.y,           "#60a5fa", "nose");
      dot(dp.chin.x,           dp.chin.y,            "#a78bfa", "chin");
      dot(dp.lShoulder.x,      dp.lShoulder.y,       "#fb923c", "L.shoulder");
      dot(dp.rShoulder.x,      dp.rShoulder.y,       "#fb923c", "R.shoulder");
      dot(dp.neckBase.x,       dp.neckBase.y,        "#4ade80", "neck base");
      dot(dp.necklaceCenter.x, dp.necklaceCenter.y,  "#facc15", "necklace ●");
      dot(dp.necklaceLeft.x,   dp.necklaceLeft.y,    "#fde68a", "◀");
      dot(dp.necklaceRight.x,  dp.necklaceRight.y,   "#fde68a", "▶");
    }
  }

  useEffect(() => { render(); });

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFileName(f.name);
    const url = URL.createObjectURL(f);
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });

    const img = new window.Image();
    img.onload = () => {
      photoImgRef.current = img;
      autoPlace(img);
    };
    img.src = url;
  }

  function resetUpload() {
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setPhotoFileName(null);
    photoImgRef.current = null;
    landmarksRef.current = null;
    debugPointsRef.current = null;
    const c = canvasRef.current;
    if (c) c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    track({ event_name: EVENTS.TRYON_COMPLETE, tool_name: "virtual-try-on" });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `stylix-tryon-${NECKLACE.id}.png`;
    a.click();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[340px_1fr]">

        {/* ── Left panel ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Necklace info */}
          <div className="border border-gold/15 bg-gold/4 px-5 py-5">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60 mb-3">Virtual Try-On</p>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-stone-900 border border-ivory/10">
                <Image src={NECKLACE.productImage} alt={NECKLACE.name} fill className="object-cover" sizes="48px" />
              </div>
              <p className="font-serif text-sm text-ivory">{NECKLACE.name}</p>
            </div>
          </div>

          {/* Upload area */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Upload Photo</p>
            <label className="flex flex-col items-center justify-center border border-dashed border-ivory/15 px-6 py-8 cursor-pointer hover:border-gold/30 transition-colors">
              <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/30 mb-1">
                {photoFileName ?? "Drag & drop or click to upload"}
              </span>
              <span className="text-[9px] text-ivory/20">JPG · PNG · WEBP · Portrait or upper body</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="sr-only" />
            </label>
            {photoUrl && (
              <button type="button" onClick={resetUpload}
                className="mt-2 text-[9px] uppercase tracking-[0.2em] text-ivory/25 hover:text-ivory/50 transition-colors">
                Clear photo
              </button>
            )}
          </div>

          {/* Placement controls */}
          {photoUrl && (
            <div className="border border-ivory/10 px-5 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60">Adjust Placement</p>
                <div className="flex items-center gap-3">
                  {detecting && (
                    <span className="text-[9px] text-ivory/30 tracking-[0.2em]">Detecting…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setDebugMode((v) => !v)}
                    className={`text-[9px] uppercase tracking-[0.2em] border px-2 py-1 transition-colors ${
                      debugMode
                        ? "border-yellow-500/60 text-yellow-400"
                        : "border-ivory/15 text-ivory/25 hover:border-ivory/30 hover:text-ivory/40"
                    }`}
                  >
                    Debug
                  </button>
                </div>
              </div>

              {debugMode && (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Position X</label>
                      <span className="text-[9px] text-ivory/30">{overlayX}%</span>
                    </div>
                    <input type="range" min={10} max={90} value={overlayX}
                      onChange={(e) => setOverlayX(Number(e.target.value))}
                      className="w-full accent-[#C9A962]" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Position Y</label>
                      <span className="text-[9px] text-ivory/30">{overlayY}%</span>
                    </div>
                    <input type="range" min={20} max={90} value={overlayY}
                      onChange={(e) => setOverlayY(Number(e.target.value))}
                      className="w-full accent-[#C9A962]" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Scale</label>
                      <span className="text-[9px] text-ivory/30">{overlayScale}%</span>
                    </div>
                    <input type="range" min={15} max={85} value={overlayScale}
                      onChange={(e) => setOverlayScale(Number(e.target.value))}
                      className="w-full accent-[#C9A962]" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Rotate</label>
                      <span className="text-[9px] text-ivory/30">{overlayRotate}°</span>
                    </div>
                    <input type="range" min={-30} max={30} value={overlayRotate}
                      onChange={(e) => setOverlayRotate(Number(e.target.value))}
                      className="w-full accent-[#C9A962]" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-ivory/40">Opacity</label>
                      <span className="text-[9px] text-ivory/30">{overlayOpacity}%</span>
                    </div>
                    <input type="range" min={20} max={100} value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-full accent-[#C9A962]" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          {photoUrl && (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={download}
                className="border border-gold/30 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-gold hover:bg-gold/8 transition-colors">
                Save Preview
              </button>
              <Link href="/bag"
                className="border border-ivory/20 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors">
                Add to Bag
              </Link>
            </div>
          )}

          {/* 3D Atelier upsell */}
          <div className="border border-gold/15 bg-gold/4 px-5 py-5">
            <p className="text-[9px] uppercase tracking-[0.35em] text-gold/60 mb-2">Private Atelier · Coming Soon</p>
            <p className="font-serif text-sm text-ivory/70 mb-1">AI-Powered Try-On</p>
            <p className="text-xs leading-relaxed text-ivory/35">
              AI-generated photorealistic necklace placement — Private Atelier Access only.
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

        {/* ── Right: canvas preview ──────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="relative min-h-[520px] border border-ivory/10 bg-ink-soft/20">
            {!photoUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/15">Virtual Try-On</p>
                <p className="font-serif text-2xl text-ivory/10">Upload a photo to begin</p>
                <p className="text-xs text-ivory/15 max-w-xs">
                  Upload a portrait or upper-body photo — the necklace overlay will appear automatically.
                </p>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="mx-auto block max-w-full max-h-[80vh]"
            />

            {photoUrl && (
              <div className="absolute top-4 right-4 border border-ivory/10 bg-ink-deep/80 backdrop-blur-sm px-3 py-2">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">{NECKLACE.name}</p>
              </div>
            )}
          </div>

          <p className="text-xs text-ivory/20">
            Virtual Try-On · {NECKLACE.name} · {photoUrl ? "Adjust placement with controls" : "Upload a photo to start"}
          </p>
        </div>
      </div>
    </div>
  );
}
