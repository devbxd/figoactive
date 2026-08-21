import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryTiles } from "@/components/CategoryTiles";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Marquee } from "@/components/Marquee";
import { INSTAGRAM_HANDLE } from "@/lib/site";

const MARQUEE_ITEMS = ["Elevate Every Rep", "Cash On Delivery", "Free Shipping In Beirut", "New Drops Weekly"];

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, featured] = await Promise.all([getProducts(), getCategories(), getFeaturedProducts(8)]);
  const editorial = products[Math.min(8, products.length - 1)];

  return (
    <main className="overflow-x-hidden">
      <section className="relative flex min-h-screen items-end overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={products[0]?.images[0]}
            className="h-full w-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/70 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-52 md:px-6 md:pb-28 md:pt-60">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.4em] text-brand-mint">
            New Season · Built To Move
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-[15vw] font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
            Own Every
            <br />
            Street
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
            We believe sweat should never dull your shine. Performance activewear for fearless athletes who own
            every stride and every street.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="bg-brand-mint px-9 py-4 font-heading text-sm font-bold uppercase tracking-widest text-brand-navy transition-transform hover:scale-[1.03]"
            >
              Shop Now
            </Link>
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/40 px-9 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-brand-mint hover:text-brand-mint"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      <ScrollReveal className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy md:text-3xl">
          Shop by category
        </h2>
        <CategoryTiles categories={categories} products={products} />
      </ScrollReveal>

      <ScrollReveal className="bg-brand-cream px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy/50">
                Fan favorites
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy md:text-3xl">
                Bestsellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-heading text-xs font-semibold uppercase tracking-wide text-brand-navy underline underline-offset-4 hover:text-brand-mint"
            >
              View all
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </ScrollReveal>

      {editorial && (
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-navy text-center text-white">
          <Image src={editorial.images[0]} alt="" fill sizes="100vw" className="object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/20 via-transparent to-brand-navy/80" />
          <div className="relative mx-auto max-w-2xl px-4 md:px-6">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.4em] text-brand-mint">
              The philosophy
            </p>
            <p className="mt-5 font-heading text-3xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
              Inspired by the fear of being average
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block bg-brand-mint px-9 py-4 font-heading text-sm font-bold uppercase tracking-widest text-brand-navy transition-transform hover:scale-[1.03]"
            >
              Shop The Collection
            </Link>
          </div>
        </section>
      )}

      <ScrollReveal className="bg-brand-black px-4 py-20 text-center text-white md:px-6">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-brand-mint">Stay in the loop</p>
        <h2 className="mx-auto mt-3 max-w-lg font-heading text-2xl font-bold uppercase tracking-wide md:text-3xl">
          New drops, restocks and exclusive discounts
        </h2>
        <div className="mx-auto mt-8 flex justify-center">
          <NewsletterForm dark />
        </div>
      </ScrollReveal>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center md:px-6">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Follow along</p>
        <a
          href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy hover:text-brand-mint"
        >
          @{INSTAGRAM_HANDLE}
        </a>
        <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6">
          {products.slice(0, 6).map((p) => (
            <div key={p.slug} className="group relative aspect-square overflow-hidden bg-brand-cream">
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
