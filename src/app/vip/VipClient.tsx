"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { generateProfile } from "@/lib/atelier/engine";
import type { AtelierAnswers, AtelierProfile } from "@/lib/atelier/engine";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  { num: "01", label: "Identity" },
  { num: "02", label: "Occasion" },
  { num: "03", label: "Aesthetic" },
  { num: "04", label: "Investment" },
  { num: "05", label: "Story" },
  { num: "06", label: "Signature" },
] as const;

const IDENTITY_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "couple", label: "Couple" },
  { value: "gift-giver", label: "Gift Giver" },
];

const OCCASION_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "business-dinner", label: "Business Dinner" },
  { value: "daily-luxury", label: "Daily Luxury" },
  { value: "travel", label: "Travel" },
  { value: "anniversary", label: "Anniversary" },
  { value: "special-event", label: "Special Event" },
  { value: "gift", label: "Gift" },
];

const AESTHETIC_OPTIONS = [
  { value: "quiet-luxury", label: "Quiet Luxury" },
  { value: "old-money", label: "Old Money" },
  { value: "romantic", label: "Romantic" },
  { value: "minimalist", label: "Minimalist" },
  { value: "artistic", label: "Artistic" },
  { value: "mystical", label: "Mystical" },
  { value: "avant-garde", label: "Avant-garde" },
];

const INVESTMENT_OPTIONS = [
  { value: "under-300", label: "Under $300" },
  { value: "300-1000", label: "$300 – $1,000" },
  { value: "1000-5000", label: "$1,000 – $5,000" },
  { value: "5000-plus", label: "$5,000+" },
  { value: "bespoke", label: "Bespoke" },
];

const LOADING_STEPS = [
  "Reading aesthetic DNA",
  "Mapping personality archetype",
  "Matching jewelry symbolism",
  "Building luxury profile",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-6 py-4 text-left transition-all duration-200 ${
        selected
          ? "border-gold/60 bg-gold/8 text-ivory"
          : "border-ivory/15 text-ivory/60 hover:border-ivory/30 hover:text-ivory/80"
      }`}
    >
      <span className="font-serif text-sm">{label}</span>
    </button>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isDone = stepNum < step;
        return (
          <div key={s.num} className="flex items-center shrink-0">
            <div className="flex flex-col items-center px-3 py-2 sm:px-4">
              <span
                className={`text-[8px] uppercase tracking-[0.35em] transition-colors ${
                  isActive
                    ? "text-gold"
                    : isDone
                    ? "text-gold/40"
                    : "text-ivory/20"
                }`}
              >
                {s.num}
              </span>
              <span
                className={`mt-0.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "text-gold"
                    : isDone
                    ? "text-ivory/40"
                    : "text-ivory/15"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="h-px w-4 bg-ivory/10 shrink-0 sm:w-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step content wrapper with fade-in ─────────────────────────────────────────
function StepPane({ children, stepKey }: { children: React.ReactNode; stepKey: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return (
    <div
      key={stepKey}
      className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {children}
    </div>
  );
}

// ── Profile result display ────────────────────────────────────────────────────
function ProfileSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-ivory/10 bg-ink-soft/20 px-7 py-6">
      <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60 mb-3">{label}</p>
      <div className="text-sm leading-relaxed text-ivory/80">{children}</div>
    </div>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────────
export function VipClient() {
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [aesthetic, setAesthetic] = useState<string | null>(null);
  const [investment, setInvestment] = useState<string | null>(null);
  const [story, setStory] = useState("");
  const [profile, setProfile] = useState<AtelierProfile | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const profileTracked = useRef(false);

  function resetWizard() {
    setStep(1);
    setIdentity(null);
    setOccasion(null);
    setAesthetic(null);
    setInvestment(null);
    setStory("");
    setProfile(null);
    setGenerating(false);
    setGeneratingStep(0);
    setEmail("");
    setSubmitted(false);
    setSubmitError(null);
    profileTracked.current = false;
  }

  function canContinue() {
    if (step === 1) return identity !== null;
    if (step === 2) return occasion !== null;
    if (step === 3) return aesthetic !== null;
    if (step === 4) return investment !== null;
    if (step === 5) return story.trim().length >= 10;
    return false;
  }

  function handleContinue() {
    if (step < 5) {
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5 | 6);
      return;
    }
    if (step === 5) {
      track({ event_name: EVENTS.ATELIER_SUBMIT, tool_name: "private-atelier" });
      setStep(6);
      setGenerating(true);
      setGeneratingStep(0);

      const answers: AtelierAnswers = {
        identity: identity!,
        occasion: occasion!,
        aesthetic: aesthetic!,
        investment: investment!,
        story,
      };

      // Sequence loading steps 750ms each
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setGeneratingStep(i);
        if (i >= LOADING_STEPS.length) {
          clearInterval(interval);
          const generated = generateProfile(answers);
          setProfile(generated);
          setGenerating(false);
        }
      }, 750);
    }
  }

  // Fire profile view event once
  useEffect(() => {
    if (profile && !profileTracked.current) {
      profileTracked.current = true;
      track({ event_name: EVENTS.ATELIER_PROFILE_VIEW, tool_name: "private-atelier" });
    }
  }, [profile]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@") || !profile) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/atelier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          answers: { identity, occasion, aesthetic, investment, story },
          profile,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Unable to save your profile. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const isStep6 = step === 6;

  return (
    <div className="min-h-screen bg-ink-deep pt-16">
      {/* ── Top chrome ─────────────────────────────────────────────────── */}
      <div className="border-b border-ivory/10 py-10 px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-gold/40" />
            <p className="text-[10px] uppercase tracking-[0.55em] text-gold/70">
              Private Atelier · Stylix
            </p>
          </div>
          <h1 className="font-serif text-3xl text-ivory sm:text-4xl">
            {isStep6 ? "Your Stylix Signature Profile" : "Personal Consultation"}
          </h1>
          {!isStep6 && (
            <div className="mt-6 overflow-x-auto">
              <ProgressBar step={step} />
            </div>
          )}
        </div>
      </div>

      {/* ── Step content ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        {/* Steps 1–5 */}
        {step <= 5 && (
          <StepPane stepKey={step}>
            <StepContent
              step={step}
              identity={identity}
              setIdentity={setIdentity}
              occasion={occasion}
              setOccasion={setOccasion}
              aesthetic={aesthetic}
              setAesthetic={setAesthetic}
              investment={investment}
              setInvestment={setInvestment}
              story={story}
              setStory={setStory}
            />

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5 | 6)}
                  className="text-[10px] uppercase tracking-[0.3em] text-ivory/30 hover:text-ivory/60 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium bg-gold/90 text-ink-deep hover:bg-gold transition-colors ${
                  !canContinue() ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                {step === 5 ? "Generate My Profile" : "Continue"}
              </button>
            </div>
          </StepPane>
        )}

        {/* Step 6 — generating or result */}
        {step === 6 && generating && (
          <StepPane stepKey={60}>
            <GeneratingView generatingStep={generatingStep} />
          </StepPane>
        )}

        {step === 6 && !generating && profile && (
          <StepPane stepKey={61}>
            <ProfileView
              profile={profile}
              answers={{ identity: identity!, occasion: occasion!, aesthetic: aesthetic!, investment: investment!, story }}
              email={email}
              setEmail={setEmail}
              submitted={submitted}
              submitting={submitting}
              submitError={submitError}
              onEmailSubmit={handleEmailSubmit}
              onReset={resetWizard}
            />
          </StepPane>
        )}
      </div>
    </div>
  );
}

// ── StepContent ───────────────────────────────────────────────────────────────
function StepContent({
  step,
  identity, setIdentity,
  occasion, setOccasion,
  aesthetic, setAesthetic,
  investment, setInvestment,
  story, setStory,
}: {
  step: number;
  identity: string | null; setIdentity: (v: string) => void;
  occasion: string | null; setOccasion: (v: string) => void;
  aesthetic: string | null; setAesthetic: (v: string) => void;
  investment: string | null; setInvestment: (v: string) => void;
  story: string; setStory: (v: string) => void;
}) {
  const stepData = [
    {
      title: "Tell us who you are",
      subtitle: "Every masterpiece begins with understanding its owner.",
      options: IDENTITY_OPTIONS,
      value: identity,
      setValue: setIdentity,
    },
    {
      title: "Tell us your occasion",
      subtitle: "Jewelry exists to celebrate meaningful moments.",
      options: OCCASION_OPTIONS,
      value: occasion,
      setValue: setOccasion,
    },
    {
      title: "Describe your aesthetic",
      subtitle: "Beauty is deeply personal.",
      options: AESTHETIC_OPTIONS,
      value: aesthetic,
      setValue: setAesthetic,
    },
    {
      title: "Your investment preference",
      subtitle: "Define the level of craftsmanship you are exploring.",
      options: INVESTMENT_OPTIONS,
      value: investment,
      setValue: setInvestment,
    },
  ];

  if (step >= 1 && step <= 4) {
    const s = stepData[step - 1];
    return (
      <div className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-4">
          {STEPS[step - 1].num} · {STEPS[step - 1].label}
        </p>
        <h2 className="font-serif text-2xl text-ivory sm:text-3xl mb-2">{s.title}</h2>
        <p className="text-sm text-ivory/50 mb-10">{s.subtitle}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {s.options.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={s.value === opt.value}
              onClick={() => s.setValue(opt.value)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-4">
          05 · Story
        </p>
        <h2 className="font-serif text-2xl text-ivory sm:text-3xl mb-2">
          Tell our atelier director your vision
        </h2>
        <p className="text-sm text-ivory/50 mb-10">
          What story do you want your jewelry to tell?
        </p>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={7}
          placeholder="Describe the occasion, the feeling you want to carry, the symbolism that matters to you, or any reference that speaks to your vision."
          className="w-full border border-ivory/15 bg-ink-soft/20 px-5 py-4 text-sm text-ivory placeholder-ivory/20 focus:border-gold/50 focus:outline-none transition-colors resize-none"
        />
        <p className="mt-2 text-[9px] text-ivory/25">
          {story.trim().length < 10
            ? `${10 - story.trim().length} more character${10 - story.trim().length === 1 ? "" : "s"} to continue`
            : ""}
        </p>
      </div>
    );
  }

  return null;
}

// ── GeneratingView ────────────────────────────────────────────────────────────
function GeneratingView({ generatingStep }: { generatingStep: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center gap-3 mb-12">
        <span className="h-px w-8 bg-gold/30" />
        <p className="text-[10px] uppercase tracking-[0.55em] text-gold/50">
          Analyzing your luxury profile
        </p>
        <span className="h-px w-8 bg-gold/30" />
      </div>
      <div className="space-y-5 w-full max-w-xs">
        {LOADING_STEPS.map((label, i) => {
          const done = i < generatingStep;
          const active = i === generatingStep;
          return (
            <div key={label} className="flex items-center gap-4">
              <div className={`h-px flex-1 transition-all duration-500 ${done ? "bg-gold/50" : "bg-ivory/10"}`} />
              <p className={`text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                done ? "text-gold/60" : active ? "text-ivory/70 animate-pulse" : "text-ivory/20"
              }`}>
                {label}
              </p>
              <div className={`h-px flex-1 transition-all duration-500 ${done ? "bg-gold/50" : "bg-ivory/10"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ProfileView ───────────────────────────────────────────────────────────────
function ProfileView({
  profile,
  answers,
  email,
  setEmail,
  submitted,
  submitting,
  submitError,
  onEmailSubmit,
  onReset,
}: {
  profile: AtelierProfile;
  answers: AtelierAnswers;
  email: string;
  setEmail: (v: string) => void;
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  onEmailSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  return (
    <div className="max-w-2xl space-y-6">

      {/* Archetype card */}
      <div className="border border-gold/25 bg-gradient-to-b from-ink-soft/60 to-ink-deep px-8 py-8">
        <p className="text-[9px] uppercase tracking-[0.45em] text-gold/60 mb-3">Luxury Archetype</p>
        <p className="font-serif text-3xl text-ivory leading-tight sm:text-4xl">{profile.archetype}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[answers.identity, answers.occasion, answers.aesthetic].map((tag) => (
            <span
              key={tag}
              className="border border-ivory/10 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-ivory/30"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>

      {/* Profile sections */}
      <ProfileSection label="Style DNA">
        <p>{profile.styleDna}</p>
      </ProfileSection>

      <ProfileSection label="Occasion Match">
        <p>{profile.occasionMatch}</p>
      </ProfileSection>

      <ProfileSection label="Recommended Collection">
        <p className="font-serif text-base text-ivory mb-2">{profile.collection}</p>
        <p className="text-ivory/50 text-xs">Curated based on your investment preference and aesthetic profile.</p>
      </ProfileSection>

      <ProfileSection label="Why This Piece">
        <p className="italic">{profile.whyPiece}</p>
      </ProfileSection>

      {/* Email capture */}
      <div className="border border-ivory/10 bg-ink-soft/20 px-7 py-8 mt-8">
        <p className="text-[9px] uppercase tracking-[0.4em] text-gold/60 mb-3">Save Your Profile</p>
        <p className="font-serif text-lg text-ivory mb-1">Your Stylix Signature Profile</p>
        <p className="text-sm text-ivory/50 mb-6">
          Enter your email and we will send you this profile along with personalised recommendations from our atelier.
        </p>

        {submitted ? (
          <div className="border border-gold/20 px-6 py-5 text-center">
            <p className="font-serif text-base text-ivory mb-1">Your profile has been sent.</p>
            <p className="text-xs text-ivory/40">Check your inbox for your Stylix Signature Profile.</p>
          </div>
        ) : (
          <form onSubmit={onEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full border border-ivory/15 bg-transparent px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:border-gold/50 focus:outline-none transition-colors"
            />
            {submitError && (
              <p className="text-xs text-red-400">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={submitting || !email.includes("@")}
              className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium bg-gold/90 text-ink-deep hover:bg-gold transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {submitting ? "Saving…" : "Save My Profile"}
            </button>
          </form>
        )}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-4 sm:flex-row pt-4">
        <Link
          href="/collection"
          className="inline-flex items-center justify-center px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium border border-gold/30 text-gold hover:border-gold transition-colors"
        >
          Explore Collection
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="text-[10px] uppercase tracking-[0.3em] text-ivory/25 hover:text-ivory/50 transition-colors"
        >
          Begin Again
        </button>
      </div>
    </div>
  );
}
