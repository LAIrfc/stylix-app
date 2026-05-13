import type { Product } from "@/lib/types/product";
import type {
  JewelryCategory,
  MoodTag,
  OccasionTag,
  StyleTag,
} from "@/lib/types/product";

/** Optional advisor inputs — maps to future `advisor_sessions` row. */
export interface AdvisorInput {
  occasion: OccasionTag;
  style: StyleTag;
  mood: MoodTag;
  /** 1 = under ~$1.2k, 2 = ~$1.2–2k, 3 = ~$2–3k, 4 = open */
  budgetTier?: 1 | 2 | 3 | 4;
  jewelryCategory?: JewelryCategory | "all";
}

export interface ScoredProduct {
  product: Product;
  score: number;
  matchReasons: string[];
}

export interface AdvisorResult {
  recommendations: ScoredProduct[];
  /** One editorial sentence describing the style direction. */
  styleDirection: string;
  /** Max two sentences: lead piece + styling instruction. */
  stylingNote: string;
}

/**
 * Style tags considered appropriate for professional / work contexts.
 * Products lacking ALL of these receive a work-occasion penalty.
 */
const PROFESSIONAL_STYLES: StyleTag[] = ["classic", "elegant", "minimal", "minimalist"];

function styleMatches(tags: StyleTag[], selected: StyleTag): boolean {
  if (tags.includes(selected)) return true;
  if (
    (selected === "minimalist" && tags.includes("minimal")) ||
    (selected === "minimal" && tags.includes("minimalist"))
  ) {
    return true;
  }
  return false;
}

function hasProfessionalStyle(tags: StyleTag[]): boolean {
  return PROFESSIONAL_STYLES.some((s) => tags.includes(s));
}

/**
 * Rule-based matcher: scores products by tag overlap + occasion/style/mood conflict guards.
 * Replace with LLM / Supabase edge function when ready.
 */
export function scoreProduct(input: AdvisorInput, product: Product): ScoredProduct {
  const reasons: string[] = [];
  let score = 0;

  // ── Occasion ──────────────────────────────────────────────────────────────
  if (product.tags.occasionTags.includes(input.occasion)) {
    score += 4;
    reasons.push(`Suited to ${input.occasion.replace("-", " ")} moments in our edit.`);
  } else if (input.occasion === "work") {
    // Work is a professional context — strongly penalise off-occasion products.
    score -= 3;
  }

  // ── Style ─────────────────────────────────────────────────────────────────
  if (styleMatches(product.tags.styleTags, input.style)) {
    score += 4;
    reasons.push(`Aligns with your ${input.style} direction.`);
  }

  // ── Mood ──────────────────────────────────────────────────────────────────
  if (product.tags.moodTags.includes(input.mood)) {
    score += 3;
    reasons.push(`Carries the ${input.mood} mood you selected.`);
  }

  // ── Work-safe guard ───────────────────────────────────────────────────────
  // Products whose style vocabulary is entirely theatrical (bold/celestial only)
  // are inappropriate for a work context regardless of other signals.
  if (input.occasion === "work" && !hasProfessionalStyle(product.tags.styleTags)) {
    score -= 3;
  }

  // ── Mood-style compatibility bonuses ─────────────────────────────────────
  if (
    input.mood === "confident" &&
    hasProfessionalStyle(product.tags.styleTags)
  ) {
    score += 1;
  }
  if (
    input.mood === "polished" &&
    product.tags.styleTags.includes("elegant")
  ) {
    score += 1;
  }

  // ── Category filter ───────────────────────────────────────────────────────
  if (input.jewelryCategory && input.jewelryCategory !== "all") {
    if (product.category === input.jewelryCategory) {
      score += 2;
      reasons.push(`Fits your ${input.jewelryCategory} focus.`);
    } else {
      score -= 1;
    }
  }

  // ── Budget gate ───────────────────────────────────────────────────────────
  if (input.budgetTier !== undefined) {
    if (product.budgetTier <= input.budgetTier) {
      score += 1;
      reasons.push("Respects your budget frame.");
    } else {
      score -= 2;
      reasons.push("Sits above your indicated budget — still included if you wish to explore.");
    }
  }

  if (reasons.length === 0) {
    reasons.push("A versatile piece from our house edit that bridges several moods.");
    score = Math.max(score, 1);
  }

  return { product, score, matchReasons: reasons };
}

export function recommend(
  catalog: Product[],
  input: AdvisorInput,
  maxResults = 3
): AdvisorResult {
  const gated = catalog.filter((p) => {
    if (input.jewelryCategory && input.jewelryCategory !== "all") {
      if (p.category !== input.jewelryCategory) return false;
    }
    if (input.budgetTier !== undefined && p.budgetTier > input.budgetTier) {
      return false;
    }
    return true;
  });

  const pool = gated.length > 0 ? gated : catalog;

  const scored = pool
    .map((p) => scoreProduct(input, p))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, maxResults);
  const recommendations = top.length > 0 ? top : [scored[0]].filter(Boolean);

  return {
    recommendations,
    styleDirection: buildStyleDirection(input),
    stylingNote: buildStylingNote(input, recommendations),
  };
}

// ── Narrative builders ────────────────────────────────────────────────────────

const occasionContext: Record<OccasionTag, string> = {
  work: "a disciplined work context",
  "black-tie": "elevated evening dressing",
  "wedding guest": "a celebratory gathering",
  "date night": "intimate, close-range attention",
  "casual brunch": "effortless daytime ease",
  "holiday gift": "a considered, lasting gesture",
};

const styleCharacter: Record<StyleTag, string> = {
  classic: "clean, time-honored",
  elegant: "refined, elongated",
  bold: "architectural, decisive",
  romantic: "soft-curved, warm",
  celestial: "luminous, constellation-inspired",
  minimal: "restrained, precise",
  minimalist: "essential, stripped-back",
};

const moodFinish: Record<MoodTag, string> = {
  confident: "confident authority",
  dreamy: "ethereal softness",
  sensual: "tactile allure",
  polished: "impeccable finish",
  playful: "effortless wit",
  powerful: "commanding presence",
};

function buildStyleDirection(input: AdvisorInput): string {
  return `For ${occasionContext[input.occasion]}, ${styleCharacter[input.style]} lines carry a note of ${moodFinish[input.mood]}.`;
}

function buildStylingNote(input: AdvisorInput, recs: ScoredProduct[]): string {
  const primary = recs[0]?.product;
  if (!primary) {
    return "One deliberate piece is all the look needs. Choose with intention.";
  }
  if (input.occasion === "work") {
    return `${primary.name} leads with quiet authority — the kind that doesn't announce itself. Keep everything else edited, and let the metal's finish deliver the confidence.`;
  }
  if (input.occasion === "black-tie") {
    return `${primary.name} carries the evening. Let it speak; keep the lines uninterrupted so light travels cleanly.`;
  }
  if (input.occasion === "wedding guest" || input.occasion === "date night") {
    return `${primary.name} sets a luminous tone — present without competing. Add one secondary accent at most, and resist overstatement.`;
  }
  return `${primary.name} is your visual anchor. Style around it with intention, and the entire look reads curated, confident, and unmistakably considered.`;
}
