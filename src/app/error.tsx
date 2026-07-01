"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="font-serif text-2xl text-stone-900">{t.errors.somethingWrong}</h2>
      <p className="mt-3 max-w-md text-sm text-stone-500">
        {t.errors.unexpectedError}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft"
      >
        {t.errors.tryAgain}
      </button>
    </div>
  );
}
