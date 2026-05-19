"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Necklace data ─────────────────────────────────────────────────────────────
const NECKLACE = {
  id: "aurora-necklace",
  name: "Aurora Celestial Necklace",
  productImage: "/tryon/aurora-necklace/product-front.jpg",
};

// ── Draw necklace shape on canvas ─────────────────────────────────────────────
function drawNecklace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  rotateDeg: number,
  opacity: number,
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(cx, cy);
  ctx.rotate((rotateDeg * Math.PI) / 180);

  const hw = width / 2;
  const chainDrop = width * 0.18;

  // Main chain arc
  ctx.strokeStyle = "#C9A962";
  ctx.lineWidth = Math.max(2, width * 0.012);
  ctx.beginPath();
  ctx.moveTo(-hw, 0);
  ctx.quadraticCurveTo(0, chainDrop, hw, 0);
  ctx.stroke();

  // Inner chain (layered look)
  ctx.strokeStyle = "rgba(201,169,98,0.5)";
  ctx.lineWidth = Math.max(1.5, width * 0.008);
  ctx.beginPath();
  ctx.moveTo(-hw * 0.85, 0);
  ctx.quadraticCurveTo(0, chainDrop * 0.7, hw * 0.85, 0);
  ctx.stroke();

  // Star charms along the chain
  const numStars = 7;
  ctx.fillStyle = "#C9A962";
  for (let i = 0; i < numStars; i++) {
    const t = (i + 1) / (numStars + 1);
    const x = -hw + t * width;
    const progress = Math.sin(t * Math.PI);
    const y = chainDrop * progress;
    drawStar(ctx, x, y, width * 0.018, 4);
  }

  // Center pendant
  ctx.fillStyle = "#C9A962";
  ctx.beginPath();
  ctx.arc(0, chainDrop + width * 0.03, width * 0.025, 0, Math.PI * 2);
  ctx.fill();

  // Crystal accent on pendant
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.arc(0, chainDrop + width * 0.025, width * 0.012, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points: number) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.4;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// ── Main component ────────────────────────────────────────────────────────────

export function TryOnClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);

  // Overlay controls — defaults for neck area
  const [overlayX, setOverlayX] = useState(50);
  const [overlayY, setOverlayY] = useState(58);
  const [overlayScale, setOverlayScale] = useState(55);
  const [overlayRotate, setOverlayRotate] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(92);

  // Render canvas
  function render() {
    const canvas = canvasRef.current;
    const img = photoImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const cx = (overlayX / 100) * canvas.width;
    const cy = (overlayY / 100) * canvas.height;
    const neckWidth = (overlayScale / 100) * canvas.width;

    drawNecklace(ctx, cx, cy, neckWidth, overlayRotate, overlayOpacity / 100);
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
      render();
    };
    img.src = url;
  }

  function resetUpload() {
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setPhotoFileName(null);
    photoImgRef.current = null;
    const c = canvasRef.current;
    if (c) c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
              <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60">Adjust Placement</p>

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
              className="mx-auto max-h-[80vh] w-full object-contain"
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
