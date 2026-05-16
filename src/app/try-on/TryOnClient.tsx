"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/data/products";
import type { Product } from "@/lib/types/product";

// ── Necklace AI preview mapping ───────────────────────────────────────────────
const NECKLACE_ITEMS = [
  {
    id: "aurora-necklace",
    name: "Aurora Celestial Necklace",
    productImage: "/tryon/aurora-necklace/product-front.jpg",
    transparentAsset: "/tryon/aurora-necklace/transparent.png",
    detailImage: "/tryon/aurora-necklace/detail-closeup.jpg",
    wornReferenceImage: "/tryon/aurora-necklace/worn-reference.png",
  },
] as const;

type NecklaceItem = typeof NECKLACE_ITEMS[number];

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

// ── Status line ───────────────────────────────────────────────────────────────
type StatusKey =
  | "idle"
  | "photo-received"
  | "generating"
  | "generated"
  | "failed"
  | "demo";

function StatusBadge({ status, demo, apiKeyMissing }: { status: StatusKey; demo: boolean; apiKeyMissing: boolean }) {
  const lines: Record<StatusKey, string> = {
    idle: "Waiting for photo upload",
    "photo-received": "Photo received — ready to generate",
    generating: "Generating preview…",
    generated: demo ? "Preview generated (demo mode)" : "Preview generated",
    failed: "Generation failed — see error below",
    demo: "Demo mode — no API key connected",
  };

  const colors: Record<StatusKey, string> = {
    idle: "text-ivory/25",
    "photo-received": "text-gold/60",
    generating: "text-gold animate-pulse",
    generated: demo ? "text-ivory/40" : "text-gold/80",
    failed: "text-red-400",
    demo: "text-ivory/30",
  };

  return (
    <div className="border border-ivory/8 bg-ink-soft/20 px-4 py-3 space-y-1">
      <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/30">Status</p>
      <p className={`text-xs ${colors[status]}`}>{lines[status]}</p>
      <p className={`text-[9px] ${apiKeyMissing ? "text-red-400/60" : "text-gold/40"}`}>
        OpenAI API key: {apiKeyMissing ? "not connected" : "detected"}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TryOnClient() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("piece");

  const [selected, setSelected] = useState<Product>(() => {
    const found = initialSlug ? products.find((p) => p.slug === initialSlug) : undefined;
    return found ?? products[0];
  });

  const [selectedNecklace, setSelectedNecklace] = useState<NecklaceItem>(NECKLACE_ITEMS[0]);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  // Upload state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const uploadFileRef = useRef<File | null>(null);

  // AI generation state
  const [status, setStatus] = useState<StatusKey>("idle");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiDemo, setAiDemo] = useState(false);
  const [aiDemoMessage, setAiDemoMessage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Detect API key status from demo response
  useEffect(() => {
    if (aiDemo) setApiKeyMissing(true);
    else if (status === "generated") setApiKeyMissing(false);
  }, [aiDemo, status]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    uploadFileRef.current = f;
    setPhotoFileName(f.name);
    const url = URL.createObjectURL(f);
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    setAiResult(null);
    setAiError(null);
    setAiDemo(false);
    setAiDemoMessage(null);
    setStatus("photo-received");
  }

  async function generateAIPreview() {
    if (!uploadFileRef.current) {
      setAiError("Please upload a photo first.");
      return;
    }
    setStatus("generating");
    setAiResult(null);
    setAiError(null);
    setAiDemo(false);
    setAiDemoMessage(null);

    try {
      const fd = new FormData();
      fd.append("image", uploadFileRef.current);
      fd.append("necklaceId", selectedNecklace.id);

      const res = await fetch("/api/tryon/generate", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setAiResult(data.resultImage);
      setAiDemo(data.demo ?? false);
      setAiDemoMessage(data.message ?? null);
      setApiKeyMissing(data.demo ?? false);
      setStatus(data.demo ? "demo" : "generated");
    } catch (err) {
      setAiError((err as Error).message ?? "Something went wrong.");
      setStatus("failed");
    }
  }

  function savePreview() {
    if (!aiResult) return;
    const a = document.createElement("a");
    a.href = aiResult;
    a.download = `stylix-ai-preview-${selectedNecklace.id}.png`;
    a.click();
  }

  function resetUpload() {
    uploadFileRef.current = null;
    setPhotoUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setPhotoFileName(null);
    setAiResult(null);
    setAiError(null);
    setAiDemo(false);
    setAiDemoMessage(null);
    setStatus("idle");
  }

  const aiCommentary = getAICommentary(selected, occasion, mood);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[340px_1fr]">

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

          {/* Input mode */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Input Mode</p>
            <div className="flex border border-ivory/15">
              <button type="button"
                className="flex-1 py-3 text-[10px] uppercase tracking-[0.2em] bg-gold/10 text-gold">
                Photo Upload
              </button>
              <button type="button" disabled
                className="flex-1 py-3 text-[10px] uppercase tracking-[0.2em] text-ivory/20 cursor-not-allowed">
                Live Camera <span className="text-[8px] text-gold/30 ml-1">Beta</span>
              </button>
            </div>
            <p className="mt-1.5 text-[9px] text-ivory/20">Live Camera — Private Atelier Beta · Coming Soon</p>
          </div>

          {/* Upload area */}
          <div>
            <label className="flex flex-col items-center justify-center border border-dashed border-ivory/15 px-6 py-8 cursor-pointer hover:border-gold/30 transition-colors">
              <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/30 mb-1">
                {photoFileName ? photoFileName : "Drag & drop or click to upload"}
              </span>
              <span className="text-[9px] text-ivory/20">JPG · PNG · WEBP · Upper body or portrait</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="sr-only" />
            </label>
            {photoUrl && (
              <button type="button" onClick={resetUpload}
                className="mt-2 text-[9px] uppercase tracking-[0.2em] text-ivory/25 hover:text-ivory/50 transition-colors">
                Clear photo
              </button>
            )}
          </div>

          {/* Necklace selector */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Select Necklace</p>
            {NECKLACE_ITEMS.map((n) => (
              <button key={n.id} type="button" onClick={() => setSelectedNecklace(n)}
                className={`flex w-full items-center gap-3 border p-2 text-left transition-colors ${
                  selectedNecklace.id === n.id ? "border-gold/40 bg-gold/8" : "border-ivory/10 hover:border-ivory/20"
                }`}>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-stone-900">
                  <Image src={n.productImage} alt={n.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <p className="font-serif text-sm text-ivory">{n.name}</p>
                  {selectedNecklace.id === n.id && (
                    <p className="text-[9px] text-gold/50 uppercase tracking-wider">Selected</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Piece selector (all products for styling context) */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 mb-3">Styling Reference</p>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
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

        {/* ── Right: AI preview ───────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Status */}
          <StatusBadge status={status} demo={aiDemo} apiKeyMissing={apiKeyMissing} />

          {/* Generate button */}
          <button type="button" onClick={generateAIPreview}
            disabled={status === "generating" || !photoUrl}
            className="w-full border border-gold/40 py-4 text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-gold/8 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {status === "generating" ? "Creating your AI styling preview…" : "Generate AI Styling Preview"}
          </button>

          {/* Demo mode notice */}
          {aiDemo && aiDemoMessage && (
            <div className="border border-ivory/10 bg-ink-soft/20 px-5 py-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/30 mb-1">Demo Mode</p>
              <p className="text-sm text-ivory/50">{aiDemoMessage}</p>
              <p className="mt-2 text-[9px] text-ivory/25">
                Add <code className="text-gold/50">OPENAI_API_KEY</code> to <code className="text-gold/50">.env.local</code> to enable live AI generation.
              </p>
            </div>
          )}

          {/* Error */}
          {aiError && (
            <div className="border border-red-400/20 px-5 py-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-red-400/60 mb-1">Error</p>
              <p className="text-sm text-red-400">{aiError}</p>
            </div>
          )}

          {/* Preview area */}
          <div className="relative min-h-[520px] border border-ivory/10 bg-ink-soft/20 flex flex-col">
            {!photoUrl && !aiResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/15">AI Styling Preview</p>
                <p className="font-serif text-2xl text-ivory/10">Upload a photo to begin</p>
                <p className="text-xs text-ivory/15 max-w-xs">
                  Upload a portrait or upper-body photo, select a necklace, then click Generate.
                </p>
              </div>
            )}

            {/* Uploaded photo (shown before generation) */}
            {photoUrl && !aiResult && status !== "generating" && (
              <div className="flex flex-col items-center justify-center flex-1 p-4 gap-3">
                <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/30">Your Photo</p>
                <div className="relative w-full max-w-md overflow-hidden border border-ivory/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Uploaded photo" className="w-full object-contain max-h-[60vh]" />
                </div>
                <p className="text-[9px] text-ivory/20">Click Generate AI Styling Preview above</p>
              </div>
            )}

            {/* Generating state */}
            {status === "generating" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 animate-pulse">
                  Creating your AI styling preview…
                </p>
                <p className="text-xs text-ivory/25">This may take 10–20 seconds</p>
              </div>
            )}

            {/* AI result */}
            {aiResult && (
              <div className="flex flex-col flex-1">
                <div className="relative flex-1 min-h-[400px]">
                  <Image
                    src={aiResult}
                    alt="AI Styling Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 border border-ivory/10 bg-ink-deep/80 backdrop-blur-sm px-3 py-2">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60">{selectedNecklace.name}</p>
                    {aiDemo && <p className="text-[8px] text-ivory/25 mt-0.5">Demo mode</p>}
                  </div>
                </div>

                {/* Result actions */}
                <div className="flex gap-3 flex-wrap p-4 border-t border-ivory/8">
                  <button type="button" onClick={savePreview}
                    className="border border-ivory/20 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors">
                    Save Preview
                  </button>
                  <button type="button"
                    onClick={() => navigator.share?.({ title: "Stylix AI Preview", url: window.location.href })}
                    className="border border-ivory/20 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors">
                    Share
                  </button>
                  <Link href="/bag"
                    className="border border-gold/30 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-gold hover:bg-gold/8 transition-colors">
                    Add to Bag
                  </Link>
                  <button type="button" onClick={resetUpload}
                    className="border border-ivory/10 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ivory/30 hover:text-ivory/50 transition-colors">
                    Try Another Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-ivory/20">
            AI Styling Preview · {selectedNecklace.name} · {aiDemo ? "Demo mode — connect OpenAI API key for live generation" : status === "generated" ? "Live AI generation" : "Upload a photo and click Generate"}
          </p>
        </div>
      </div>
    </div>
  );
}
