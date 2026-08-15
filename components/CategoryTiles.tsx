import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

export function CategoryTiles({ categories, products }: { categories: string[]; products: Product[] }) {
  const tiles = categories
    .map((c) => ({ category: c, image: products.find((p) => p.category === c)?.images[0] }))
    .filter((t) => t.image);

  if (tiles.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map(({ category, image }) => (
        <Link
          key={category}
          href={`/shop?category=${encodeURIComponent(category)}`}
          className="group relative block overflow-hidden bg-brand-navy"
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={image!}
              alt={category}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover opacity-80 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
          <p className="absolute inset-x-0 bottom-4 text-center font-heading text-sm font-bold uppercase tracking-widest text-white">
            {category}
          </p>
        </Link>
      ))}
    </div>
  );
}
