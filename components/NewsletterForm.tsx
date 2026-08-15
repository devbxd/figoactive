"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter-actions";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    const res = await subscribeToNewsletter(email);
    setStatus(res.ok ? "done" : "error");
    if (res.ok) setEmail("");
  }

  if (status === "done") {
    return (
      <p className={`text-sm font-medium ${dark ? "text-brand-mint" : "text-brand-navy"}`}>
        You&apos;re on the list! 🎉
      </p>
    );
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
        disabled={status === "loading"}
        className="shrink-0 bg-brand-mint px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-widest text-brand-navy hover:opacity-90 disabled:opacity-50"
      >
        Join
      </button>
      {status === "error" && <p className="text-xs text-red-500">Something went wrong.</p>}
    </form>
  );
}
