import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Shop</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`px-4 py-1.5 font-heading text-xs uppercase tracking-wide ${
            !category ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/shop?category=${encodeURIComponent(c)}`}
            className={`px-4 py-1.5 font-heading text-xs uppercase tracking-wide ${
              category === c ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
