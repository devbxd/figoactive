import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-mint px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
            Sale
          </span>
        )}
      </div>
      <p className="mt-3 font-heading text-sm uppercase tracking-wide text-brand-navy">{product.name}</p>
      <p className="mt-1 text-sm">
        {hasDiscount ? (
          <>
            <span className="mr-2 text-neutral-400 line-through">${product.compareAtPrice!.toFixed(2)}</span>
            <span className="font-semibold text-brand-navy">${product.price.toFixed(2)}</span>
          </>
        ) : (
          <span className="font-semibold text-brand-navy">${product.price.toFixed(2)}</span>
        )}
      </p>
    </Link>
  );
}
