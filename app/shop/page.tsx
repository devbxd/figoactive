import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SortSelect } from "@/components/SortSelect";

export const metadata = { title: "Shop" };

const SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.variants.map((v) => v.size).filter(Boolean)))) as string[];

function buildHref(params: { category?: string; q?: string; size?: string; sort?: string }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);
  if (params.size) qs.set("size", params.size);
  if (params.sort) qs.set("sort", params.sort);
  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; size?: string; sort?: string }>;
}) {
  const { category, q, size, sort } = await searchParams;

  let products = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;

  if (q) {
    const needle = q.trim().toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle)
    );
  }

  if (size) {
    products = products.filter((p) => p.variants.some((v) => v.size === size));
  }

  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === "name-asc") products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main>
      <div className="bg-brand-navy px-4 py-14 text-center text-white md:px-6">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-brand-mint">
          {q ? `Results for "${q}"` : category ?? "The full collection"}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold uppercase tracking-wide md:text-5xl">Shop</h1>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ q, size, sort })}
            className={`px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide ${
              !category ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600 hover:border-brand-navy"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={buildHref({ category: c, q, size, sort })}
              className={`px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide ${
                category === c ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600 hover:border-brand-navy"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          {SIZES.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ category, q, sort })}
                className={`h-8 min-w-8 px-2 font-heading text-xs uppercase tracking-wide ${
                  !size ? "bg-brand-black text-white" : "border border-neutral-300 text-neutral-500 hover:border-brand-navy"
                }`}
              >
                All sizes
              </Link>
              {SIZES.map((s) => (
                <Link
                  key={s}
                  href={buildHref({ category, q, sort, size: size === s ? undefined : s })}
                  className={`flex h-8 min-w-8 items-center justify-center px-2 font-heading text-xs uppercase tracking-wide ${
                    size === s ? "bg-brand-black text-white" : "border border-neutral-300 text-neutral-500 hover:border-brand-navy"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          )}
          <SortSelect category={category} q={q} size={size} sort={sort} />
        </div>

        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}
