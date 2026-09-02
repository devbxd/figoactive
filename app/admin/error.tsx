"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="font-heading text-xl font-bold uppercase tracking-wide text-brand-navy">Something went wrong</h1>
      <p className="mt-3 text-sm text-neutral-600">
        This didn't save. This can happen with a file that's too large, a slow connection, or a temporary hiccup —
        try again, and if it keeps happening try a smaller image or reloading the page.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="bg-brand-navy px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/admin"
          className="border border-neutral-300 px-6 py-2.5 text-sm uppercase tracking-wide text-neutral-700 hover:bg-neutral-100"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
