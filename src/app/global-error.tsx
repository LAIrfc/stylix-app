"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center font-sans">
        <h2 className="text-2xl font-semibold text-stone-900">Something went wrong</h2>
        <p className="mt-3 max-w-md text-sm text-stone-500">
          A critical error occurred. Please refresh the page.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white"
        >
          Refresh
        </button>
      </body>
    </html>
  );
}
