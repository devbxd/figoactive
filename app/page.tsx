import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryTiles } from "@/components/CategoryTiles";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CountdownBanner } from "@/components/CountdownBanner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { INSTAGRAM_HANDLE, SALE_LABEL, SALE_ENDS_AT } from "@/lib/site";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = products.slice(0, 8);
  const heroImage = products[0]?.images[0]?.url;

  return (
    <main>
      <CountdownBanner label={SALE_LABEL} endsAt={SALE_ENDS_AT} />

      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          {heroImage && (
            <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/20" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center md:px-6">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-brand-mint">Unapologetically bold</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-heading text-4xl font-bold uppercase leading-tight tracking-tight md:text-6xl">
            Elevate Your Urban Workout
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-white/80 md:text-base">
            We believe sweat should never dull your shine. Gear for fearless athletes who own every stride and
            every street.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-brand-mint px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-widest text-brand-navy transition-transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <ScrollReveal className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="mb-6 text-center font-heading text-xl font-bold uppercase tracking-wide text-brand-navy">
          Shop by category
        </h2>
        <CategoryTiles categories={categories} products={products} />
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Bestsellers</h2>
          <Link href="/shop" className="font-heading text-xs uppercase tracking-wide text-brand-navy underline underline-offset-4 hover:text-brand-mint">
            View all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </ScrollReveal>

      <section className="bg-brand-cream px-4 py-16 text-center md:px-6">
        <p className="mx-auto max-w-2xl font-heading text-xl font-medium uppercase leading-relaxed tracking-wide text-brand-navy md:text-2xl">
          &ldquo;Inspired by the fear of being average.&rdquo;
        </p>
        <p className="mt-4 text-sm text-neutral-600">Performance activewear built to move with you, everywhere.</p>
      </section>

      <ScrollReveal className="bg-brand-navy px-4 py-16 text-center text-white md:px-6">
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-brand-mint">Stay in the loop</p>
        <h2 className="mx-auto mt-2 max-w-md font-heading text-xl font-bold uppercase tracking-wide">
          New drops, restocks and exclusive discounts
        </h2>
        <div className="mx-auto mt-6 flex justify-center">
          <NewsletterForm dark />
        </div>
      </ScrollReveal>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6">
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-neutral-500">Follow along</p>
        <a
          href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-heading text-xl font-bold uppercase tracking-wide text-brand-navy hover:text-brand-mint"
        >
          @{INSTAGRAM_HANDLE}
        </a>
        <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
          {products.slice(0, 6).map((p) => (
            <div key={p.slug} className="relative aspect-square overflow-hidden bg-brand-cream">
              {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill sizes="200px" className="object-cover" />}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
