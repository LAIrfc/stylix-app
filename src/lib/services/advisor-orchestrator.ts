/**
 * Application layer hook for the AI Advisor.
 * MVP: delegates to rule-based `recommend()`.
 *
 * Future: POST to Supabase Edge Function or external API:
 * - persist `advisor_sessions` + `advisor_results`
 * - attach outfit image analysis (vision model)
 * - replace or augment narrative with LLM output using this file as orchestrator.
 */

import { products } from "@/lib/data/products";
import { recommend, type AdvisorInput, type AdvisorResult } from "@/lib/engine/recommendation";

export function runAdvisor(input: AdvisorInput): AdvisorResult {
  return recommend(products, input, 3);
}
