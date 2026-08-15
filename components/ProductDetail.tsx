"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { Accordion } from "./Accordion";
import type { Product } from "@/lib/products";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color_label).filter(Boolean))) as string[],
    [product]
  );
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size_label).filter(Boolean))) as string[],
    [product]
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activeVariant =
    product.variants.length > 0
      ? product.variants.find(
          (v) =>
            (colors.length === 0 || v.color_label === selectedColor) &&
            (sizes.length === 0 || v.size_label === selectedSize)
        ) ?? null
      : null;

  const price = activeVariant?.price ?? product.price ?? 0;
  const compareAtPrice = activeVariant?.compare_at_price ?? product.compare_at_price;
  const hasDiscount = compareAtPrice != null && compareAtPrice > price;
  const outOfStock = activeVariant ? !activeVariant.available : false;

  const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(" / ") || null;
  const firstImage = product.images[0]?.url ?? null;
  const wishlistItem = { slug: product.slug, name: product.name, price: product.price, image: firstImage };

  function handleAdd() {
    addItem({ slug: product.slug, variant: variantLabel, name: product.name, price, image: firstImage }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream">
          {product.images[activeImage] && (
            <Image
              src={product.images[activeImage].url}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border ${
                  activeImage === i ? "border-brand-navy" : "border-neutral-200"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-neutral-400">{product.category?.name}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">{product.name}</h1>

        <p className="mt-3 text-lg">
          {hasDiscount ? (
            <>
              <span className="mr-2 text-neutral-400 line-through">${compareAtPrice!.toFixed(2)}</span>
              <span className="font-semibold text-brand-navy">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold text-brand-navy">${price.toFixed(2)}</span>
          )}
        </p>

        {colors.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 font-heading text-xs uppercase tracking-wide text-neutral-600">
              Color{selectedColor ? `: ${selectedColor}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`border px-3 py-1.5 font-heading text-xs uppercase tracking-wide ${
                    selectedColor === c ? "border-brand-navy bg-brand-navy text-white" : "border-neutral-300 text-neutral-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 font-heading text-xs uppercase tracking-wide text-neutral-600">
              Size{selectedSize ? `: ${selectedSize}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`h-10 min-w-10 border px-2 font-heading text-xs uppercase tracking-wide ${
                    selectedSize === s ? "border-brand-navy bg-brand-navy text-white" : "border-neutral-300 text-neutral-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <div className="flex items-center border border-neutral-300">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-12 w-10 items-center justify-center text-lg text-neutral-600"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-12 w-10 items-center justify-center text-lg text-neutral-600"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 bg-brand-navy py-3 text-center font-heading text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => toggle(wishlistItem)}
          className="mt-4 flex items-center gap-2 text-sm text-neutral-600 hover:text-brand-navy"
        >
          <svg
            viewBox="0 0 24 24"
            fill={has(product.slug) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.6"
            className={`h-5 w-5 ${has(product.slug) ? "text-brand-navy" : ""}`}
          >
            <path
              d="M12 20.5s-7.5-4.8-9.8-9.6C.7 7.4 2.3 4 5.7 3.3c2-.4 4 .5 5.3 2.4 1.3-1.9 3.3-2.8 5.3-2.4 3.4.7 5 4.1 3.5 7.6-2.3 4.8-9.8 9.6-9.8 9.6Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {has(product.slug) ? "Saved to wishlist" : "Add to wishlist"}
        </button>

        <div className="mt-8 border-t border-neutral-200">
          <Accordion title="Description" defaultOpen>
            <p className="whitespace-pre-line">{product.description || "Details coming soon."}</p>
          </Accordion>
          {sizes.length > 0 && (
            <Accordion title="Size Guide">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[360px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="py-2 pr-3 font-heading uppercase tracking-wide">Size</th>
                      <th className="py-2 pr-3 font-heading uppercase tracking-wide">Bust (in)</th>
                      <th className="py-2 pr-3 font-heading uppercase tracking-wide">Waist (in)</th>
                      <th className="py-2 font-heading uppercase tracking-wide">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "S", bust: "32-34", waist: "25-27", hips: "35-37" },
                      { s: "M", bust: "35-37", waist: "28-30", hips: "38-40" },
                      { s: "L", bust: "38-40", waist: "31-33", hips: "41-43" },
                      { s: "XL", bust: "41-43", waist: "34-36", hips: "44-46" },
                      { s: "2XL", bust: "44-46", waist: "37-39", hips: "47-49" },
                    ].map((row) => (
                      <tr key={row.s} className="border-b border-neutral-100">
                        <td className="py-2 pr-3 font-medium">{row.s}</td>
                        <td className="py-2 pr-3">{row.bust}</td>
                        <td className="py-2 pr-3">{row.waist}</td>
                        <td className="py-2">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-neutral-400">
                General reference chart — message us on WhatsApp if you&apos;re between sizes.
              </p>
            </Accordion>
          )}
          <Accordion title="Shipping & Delivery">
            <p>Beirut: $4</p>
            <p>Outside Beirut: $6</p>
          </Accordion>
          <Accordion title="Return & Exchange">
            <p>Returns accepted within 7 days if the item hasn&apos;t been worn and is in its original packaging. Message us on WhatsApp to start a return.</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
