import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductGrid } from "@/components/ProductGrid";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const description = product.description.slice(0, 155) || `${product.name} — Figo Active`;
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description, images: product.images[0] ? [product.images[0].url] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

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
    </main>
  );
}
