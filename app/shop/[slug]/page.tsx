import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductGrid } from "@/components/ProductGrid";
import { RecentlyViewed } from "@/components/RecentlyViewed";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const description = product.description.slice(0, 155) || `${product.name} — Figo Active`;
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description, images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-16 border-t border-neutral-200 pt-10">
          <h2 className="mb-8 text-center font-heading text-xl font-bold uppercase tracking-wide text-brand-navy">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed
        record={{ slug: product.slug, name: product.name, price: product.price, image: product.images[0] ?? null }}
        exclude={product.slug}
      />
    </main>
  );
}
