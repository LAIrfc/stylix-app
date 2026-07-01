"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

export function EarlyAccessWaitlist() {
  const { t } = useI18n();
  const w = t.home.waitlist;

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "female", label: w.genderFemale },
    { value: "male", label: w.genderMale },
    { value: "non-binary", label: w.genderNonBinary },
    { value: "prefer-not-to-say", label: w.genderPreferNotToSay },
  ];

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [source, setSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, country, gender, source }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? w.error);
        return;
      }

      setSuccess(true);
      setEmail("");
      setName("");
      setCountry("");
      setGender("");
      setSource("");
    } catch {
      setError(w.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t border-ivory/10 bg-ink-deep py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.2fr] lg:gap-20 lg:px-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/60">{w.eyebrow}</p>
          <h2 className="mt-6 font-serif text-3xl leading-tight text-ivory md:text-4xl">
            {w.title}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory-dim/75">{w.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-ivory/10 bg-ink-soft/25 p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">
                {w.nameLabel}
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={w.namePlaceholder}
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">
                {w.emailLabel}
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={w.emailPlaceholder}
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
              />
            </label>

            <label>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">
                {w.countryLabel}
              </span>
              <input
                type="text"
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder={w.countryPlaceholder}
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
              />
            </label>

            <label>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">
                {w.genderLabel}
              </span>
              <select
                required
                value={gender}
                onChange={(event) => setGender(event.target.value as Gender | "")}
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory focus:border-gold/60 focus:outline-none"
              >
                <option value="" className="bg-ink-deep text-ivory">
                  {w.genderSelect}
                </option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-ink-deep text-ivory">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">
                {w.interestLabel}
              </span>
              <input
                type="text"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder={w.interestPlaceholder}
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="submit" disabled={submitting} className="bg-gold text-ink-deep hover:bg-gold-light">
              {submitting ? w.submitting : w.submit}
            </Button>
            {success && (
              <p className="text-xs leading-relaxed text-gold/70">{w.success}</p>
            )}
            {error && (
              <p className="text-xs leading-relaxed text-red-300">{error}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
