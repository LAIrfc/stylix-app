"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";
import { uploadImage } from "@/lib/utils/upload";

export function VipClient() {
  const { t } = useI18n();
  const v = t.vip;
  const [done, setDone] = useState(false);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [refUploading, setRefUploading] = useState(false);
  const [refUploadError, setRefUploadError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="pt-24">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="border-b border-ivory/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow={v.eyebrow} title={v.title} />
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ivory-dim">{v.intro}</p>
        </div>
      </div>

      {/* ── Offerings grid ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-px bg-ivory/8 border border-ivory/8 lg:grid-cols-3">
          {v.offerings.map((o, i) => (
            <div
              key={o.title}
              className="group flex flex-col bg-ink-deep p-10 lg:p-12 transition-colors duration-500 hover:bg-ink-soft/60"
            >
              <p className="text-[9px] uppercase tracking-[0.45em] text-gold/50">
                {["Bespoke · Materials", "Limited · Editions", "Private · Preview"][i]}
              </p>
              <h2 className="mt-6 font-serif text-2xl leading-tight text-ivory lg:text-[1.625rem]">{o.title}</h2>
              <div className="my-8 h-px w-10 bg-gold/30 transition-all duration-500 group-hover:w-16" />
              <p className="flex-1 text-sm leading-relaxed text-ivory-dim">{o.body}</p>
            </div>
          ))}
        </div>

        {/* ── Collector details strip ───────────────────────────────── */}
        <div className="mt-16 grid gap-8 border border-ivory/10 p-10 sm:grid-cols-2 lg:grid-cols-4 lg:p-12">
          {[
            { label: "Engraving", desc: "Personal inscription, date, or symbolic motif on all pieces." },
            { label: "Gemstone Selection", desc: "Conflict-free sapphire, garnet, tourmaline, and collector-grade moissanite." },
            { label: "Numbered Editions", desc: "Each limited piece carries a unique edition number and certificate." },
            { label: "AI-Assisted Design", desc: "Stylix AI builds your symbolic profile and guides every design decision." },
          ].map((item) => (
            <div key={item.label} className="space-y-3">
              <p className="text-[9px] uppercase tracking-[0.4em] text-gold">Private Atelier</p>
              <h3 className="font-serif text-base text-ivory">{item.label}</h3>
              <p className="text-xs leading-relaxed text-ivory/50">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Inquiry form ─────────────────────────────────────────── */}
        <div className="mx-auto mt-24 max-w-2xl border border-ivory/10 p-10 lg:p-14">
          <p className="text-[9px] uppercase tracking-[0.45em] text-gold/70">Private Atelier</p>
          <h3 className="mt-4 font-serif text-2xl text-ivory">{v.form.title}</h3>
          <p className="mt-3 text-sm text-ivory-dim">{v.form.subtitle}</p>

          {done ? (
            <div className="mt-10 border border-gold/20 px-8 py-6 text-center">
              <p className="font-serif text-lg text-ivory">Your inquiry has been received.</p>
              <p className="mt-3 text-sm text-ivory-dim">{v.form.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.desiredStyle}</label>
                <input
                  name="style"
                  required
                  placeholder="e.g. Scorpio energy, dark celestial, minimal elegance"
                  className="mt-3 w-full border-b border-ivory/20 bg-transparent py-2 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.referenceImage}</label>
                <input
                  name="reference"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setRefUploadError(null);
                    setRefUploading(true);
                    setRefPreview(URL.createObjectURL(f));
                    const res = await uploadImage(f);
                    setRefUploading(false);
                    if (!res.ok) setRefUploadError(res.error.message);
                  }}
                  className="mt-3 block w-full text-sm text-ivory-dim file:mr-4 file:border file:border-gold/40 file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-gold"
                />
                {refUploading && (
                  <p className="mt-2 text-xs text-ivory-dim animate-pulse">Uploading…</p>
                )}
                {refUploadError && (
                  <p className="mt-2 text-xs text-red-400">{refUploadError}</p>
                )}
                {refPreview && !refUploadError && (
                  <div className="mt-3 relative aspect-[4/3] w-full overflow-hidden border border-ivory/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={refPreview} alt="Reference preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.story}</label>
                <textarea
                  name="story"
                  required
                  rows={4}
                  placeholder="Tell us the occasion, the symbolism that matters to you, and what you want to feel when you wear it."
                  className="mt-3 w-full border border-ivory/15 bg-ink-deep px-4 py-3 text-sm text-ivory placeholder:text-ivory/20 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.budget}</label>
                <select
                  name="budget"
                  className="mt-3 w-full border border-ivory/15 bg-ink-deep px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                >
                  {v.form.budgetOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.timeline}</label>
                <input
                  name="timeline"
                  required
                  placeholder={v.form.timelinePlaceholder}
                  className="mt-3 w-full border-b border-ivory/20 bg-transparent py-2 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.name}</label>
                  <input
                    name="name"
                    required
                    className="mt-3 w-full border-b border-ivory/20 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{v.form.email}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-3 w-full border-b border-ivory/20 bg-transparent py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit">{v.form.submit}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
