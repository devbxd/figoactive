import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;

  return (
    <main>
      <div className="bg-brand-navy px-4 py-14 text-center text-white md:px-6">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-brand-mint">
          {category ?? "The full collection"}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold uppercase tracking-wide md:text-5xl">Shop</h1>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide ${
              !category ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600 hover:border-brand-navy"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className={`px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide ${
                category === c ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600 hover:border-brand-navy"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}
