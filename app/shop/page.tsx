import Link from "next/link";
import { getProducts, getCategories } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(category), getCategories()]);

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
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${encodeURIComponent(c.slug)}`}
            className={`px-4 py-1.5 font-heading text-xs uppercase tracking-wide ${
              category === c.slug ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
