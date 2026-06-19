"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";
import { track } from "@/lib/analytics/tracker";
import { EVENTS } from "@/lib/analytics/events";

/**
 * MVP: client-only acknowledgment.
 * Future: POST to API route → `newsletter_subscribers` in Supabase.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { t } = useI18n();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track({ event_name: EVENTS.NEWSLETTER_SUBSCRIBE });
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-left">
        <span className="sr-only">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletter.emailPlaceholder}
          className="w-full border-b border-ink/20 bg-transparent py-4 text-sm text-ink placeholder:text-ink/40 focus:border-gold-muted focus:outline-none"
        />
      </label>
      <Button type="submit" variant="primary" className="shrink-0">
        {sent ? t.newsletter.received : t.newsletter.subscribe}
      </Button>
    </form>
  );
}
