"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { Accordion } from "./Accordion";
import type { Product } from "@/lib/products";
import { trackPixelEvent } from "@/lib/pixel";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[],
    [product]
  );
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[],
    [product]
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveImage((i) => (i + 1) % product.images.length);
      if (e.key === "ArrowLeft") setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, product.images.length]);

  useEffect(() => {
    trackPixelEvent("ViewContent", {
      content_ids: [product.slug],
      content_name: product.name,
      value: product.price,
      currency: "USD",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const activeVariant =
    product.variants.length > 0
      ? product.variants.find(
          (v) => (colors.length === 0 || v.color === selectedColor) && (sizes.length === 0 || v.size === selectedSize)
        ) ?? null
      : null;

  const price = activeVariant?.price ?? product.price;
  const compareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const hasDiscount = compareAtPrice != null && compareAtPrice > price;
  const outOfStock = activeVariant ? !activeVariant.available : false;

  const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(" / ") || null;
  const wishlistItem = { slug: product.slug, name: product.name, price: product.price, image: product.images[0] };

  function handleAdd() {
    addItem(
      { slug: product.slug, variant: variantLabel, name: product.name, price, image: product.images[0] },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Zoom image"
          className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-brand-cream"
        >
          <Image src={product.images[activeImage]} alt={product.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </button>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border ${
                  activeImage === i ? "border-brand-navy" : "border-neutral-200"
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-neutral-400">{product.category}</p>
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

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-2xl text-white/80 hover:text-white"
          >
            ✕
          </button>

          {product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-3xl text-white/80 hover:text-white md:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((i) => (i + 1) % product.images.length);
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-3xl text-white/80 hover:text-white md:right-6"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={product.images[activeImage]} alt={product.name} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
