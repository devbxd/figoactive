"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  initial = "",
  onSubmit,
  dark = false,
}: {
  initial?: string;
  onSubmit?: () => void;
  dark?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    onSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className={`w-full border px-4 py-2.5 text-sm focus:outline-none ${
          dark
            ? "border-white/30 bg-transparent text-white placeholder:text-white/50 focus:border-brand-mint"
            : "border-neutral-300 bg-white text-brand-navy placeholder:text-neutral-400 focus:border-brand-navy"
        }`}
      />
    </form>
  );
}
