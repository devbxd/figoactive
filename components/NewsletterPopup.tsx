"use client";

import { useEffect, useState } from "react";
import { subscribeNewsletter } from "@/app/actions";

const DISMISS_KEY = "figo-active-newsletter-popup-dismissed";

export function NewsletterPopup({ couponCode }: { couponCode: string | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // storage unavailable — just show it once for this render
    }
    const id = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(id);
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await subscribeNewsletter(email);
    setDone(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
      <div className="relative w-full max-w-sm bg-white p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
        >
          ✕
        </button>
        {done ? (
          <>
            <p className="font-heading text-lg font-bold uppercase tracking-wide text-brand-navy">You&apos;re on the list!</p>
            {couponCode && (
              <p className="mt-3 text-sm text-neutral-600">
                Use code <span className="font-mono font-semibold text-brand-navy">{couponCode}</span> at checkout.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-heading text-lg font-bold uppercase tracking-wide text-brand-navy">
              {couponCode ? "Get a discount" : "Join the list"}
            </p>
            <p className="mt-2 text-sm text-neutral-600">Sign up for restocks, new drops and exclusive discounts.</p>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="border border-neutral-300 px-3 py-2.5 text-sm focus:border-brand-navy focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-navy py-2.5 font-heading text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
              >
                {couponCode ? "Get my code" : "Join"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
