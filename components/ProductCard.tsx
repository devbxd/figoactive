"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./CartProvider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const price = product.price ?? 0;
  const hasDiscount = product.compare_at_price != null && product.compare_at_price > price;
  const percentOff = hasDiscount ? Math.round((1 - price / product.compare_at_price!) * 100) : 0;
  // Quick-add only makes sense when there's nothing to choose — a product
  // with color/size options needs its own page so the shopper can pick one.
  const canQuickAdd = product.variants.length === 0;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ slug: product.slug, variant: null, name: product.name, price, image: product.images[0]?.url ?? null });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-mint px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
            -{percentOff}%
          </span>
        )}
        {canQuickAdd && (
          <button
            type="button"
            onClick={quickAdd}
            className="absolute inset-x-2 bottom-2 translate-y-10 bg-brand-navy py-2 font-heading text-[11px] font-semibold uppercase tracking-widest text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 md:block"
          >
            {added ? "Added ✓" : "Quick add"}
          </button>
        )}
      </div>
      <p className="mt-3 font-heading text-sm uppercase tracking-wide text-brand-navy">{product.name}</p>
      <p className="mt-1 text-sm">
        {hasDiscount ? (
          <>
            <span className="mr-2 text-neutral-400 line-through">${product.compare_at_price!.toFixed(2)}</span>
            <span className="font-semibold text-brand-navy">${price.toFixed(2)}</span>
          </>
        ) : (
          <span className="font-semibold text-brand-navy">${price.toFixed(2)}</span>
        )}
      </p>
    </Link>
  );
}
