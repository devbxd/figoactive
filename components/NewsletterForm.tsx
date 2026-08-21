"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/app/actions";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await subscribeNewsletter(email);
    setDone(true);
    setEmail("");
  }

  if (done) {
    return <p className={`text-sm font-medium ${dark ? "text-brand-mint" : "text-brand-navy"}`}>You&apos;re on the list! 🎉</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className={`min-w-0 flex-1 border px-3 py-2.5 text-sm focus:outline-none ${
          dark
            ? "border-white/20 bg-transparent text-white placeholder:text-white/50 focus:border-brand-mint"
            : "border-neutral-300 focus:border-brand-navy"
        }`}
      />
      <button
        type="submit"
        className="shrink-0 bg-brand-mint px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-widest text-brand-navy hover:opacity-90"
      >
        Join
      </button>
    </form>
  );
}
