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

export function TryOnWaitlistGate() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [source, setSource] = useState("Virtual Try-On");
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
      setSource("Virtual Try-On");
    } catch {
      setError("Unable to join the waitlist right now.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold/60">
          Early Access Requested
        </p>
        <h1 className="mt-6 font-serif text-4xl text-ivory md:text-5xl">
          You are on the list.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/55">
          Thank you for joining the Virtual Try-On early access waitlist. We will contact
          you when private access opens for your region.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1.1fr] lg:gap-20 lg:px-10 lg:py-28">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold/40" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">
            Early Access
          </p>
        </div>
        <h1 className="mt-8 font-serif text-4xl leading-tight text-ivory md:text-6xl">
          Virtual Try-On is opening privately.
        </h1>
        <p className="mt-7 max-w-xl text-sm leading-relaxed text-ivory-dim/75 md:text-base">
          Stylix Virtual Try-On is currently gated for early members while we refine
          the fitting experience, necklace placement, and private AI atelier workflow.
        </p>
        <div className="mt-10 grid gap-4 border-t border-ivory/10 pt-8 sm:grid-cols-3">
          {["Private beta access", "Verified styling previews", "Designer capsule priority"].map((item) => (
            <p key={item} className="text-[10px] uppercase tracking-[0.25em] text-ivory/30">
              {item}
            </p>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border border-ivory/10 bg-ink-soft/30 p-6 sm:p-8">
        <p className="mb-8 text-[10px] uppercase tracking-[0.4em] text-gold/60">
          Join Waitlist
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">Name optional</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
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
              className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
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
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50">
              Interest / source optional
            </span>
            <input
              type="text"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Virtual Try-On"
              className="mt-3 w-full border-b border-ivory/15 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold/60 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="submit" disabled={submitting} className="bg-gold text-ink-deep hover:bg-gold-light">
            {submitting ? "Joining…" : "Join Waitlist"}
          </Button>
          {error && <p className="text-xs leading-relaxed text-red-300">{error}</p>}
        </div>
      </form>
    </div>
  );
}
