"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function EarlyAccessWaitlist() {
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
        setError(data.error ?? "Unable to join the waitlist right now.");
        return;
      }

      setSuccess(true);
      setEmail("");
      setName("");
      setCountry("");
      setGender("");
      setSource("");
    } catch {
      setError("Unable to join the waitlist right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t border-ivory/10 bg-ink-deep py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.2fr] lg:gap-20 lg:px-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/60">
            Early Access
          </p>
          <h2 className="mt-6 font-serif text-3xl leading-tight text-ivory md:text-4xl">
            Join the Stylix waitlist
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory-dim/75">
            Be first to receive private access to AI styling previews, designer capsule drops,
            and verified Virtual Styling Preview updates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-ivory/10 bg-ink-soft/25 p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Name optional</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold/60 focus:outline-none"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold/60 focus:outline-none"
              />
            </label>

            <label>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Country</span>
              <input
                type="text"
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="United States"
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold/60 focus:outline-none"
              />
            </label>

            <label>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Gender</span>
              <select
                required
                value={gender}
                onChange={(event) => setGender(event.target.value as Gender | "")}
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory focus:border-gold/60 focus:outline-none"
              >
                <option value="" className="bg-ink-deep text-ivory">Select</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-ink-deep text-ivory">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Interest / source optional</span>
              <input
                type="text"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder="Virtual Try-On, designer capsules, Instagram, referral..."
                className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold/60 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="submit" disabled={submitting} className="bg-gold text-ink-deep hover:bg-gold-light">
              {submitting ? "Joining…" : "Join Waitlist"}
            </Button>
            {success && (
              <p className="text-xs leading-relaxed text-gold/70">
                You are on the waitlist. We will be in touch when private access opens.
              </p>
            )}
            {error && (
              <p className="text-xs leading-relaxed text-red-300">
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
