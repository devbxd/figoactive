"use client";

import { useRouter } from "next/navigation";

export function SortSelect({
  category,
  q,
  size,
  sort,
}: {
  category?: string;
  q?: string;
  size?: string;
  sort?: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (size) params.set("size", size);
    if (e.target.value) params.set("sort", e.target.value);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <select
      defaultValue={sort ?? ""}
      onChange={handleChange}
      aria-label="Sort products"
      className="border border-neutral-300 bg-white px-3 py-1.5 font-heading text-xs uppercase tracking-wide text-neutral-600 focus:border-brand-navy focus:outline-none"
    >
      <option value="">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A-Z</option>
    </select>
  );
}
