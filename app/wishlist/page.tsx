"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/components/WishlistProvider";
import { useCart } from "@/components/CartProvider";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Your wishlist is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-brand-navy px-8 py-3 font-heading text-sm uppercase tracking-widest text-white hover:opacity-90"
        >
          Shop now
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Your wishlist</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 border-b border-neutral-200 pb-4">
            <Link href={`/shop/${item.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden bg-brand-cream">
              {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
            </Link>
            <div className="flex-1">
              <Link href={`/shop/${item.slug}`} className="font-heading text-sm uppercase tracking-wide text-brand-navy">
                {item.name}
              </Link>
              {item.price != null && <p className="mt-1 text-sm font-semibold text-brand-navy">${item.price.toFixed(2)}</p>}
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      slug: item.slug,
                      variant: null,
                      productId: item.productId,
                      variantId: null,
                      name: item.name,
                      price: item.price ?? 0,
                      image: item.image,
                    })
                  }
                  className="font-heading text-xs uppercase tracking-wide text-brand-navy underline underline-offset-2"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="text-xs uppercase tracking-wide text-neutral-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
