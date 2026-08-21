"use client";

import Image from "next/image";
import { deleteProductImage, reorderProductImage } from "./actions";

type Img = { id: string; url: string };

export function ProductImageGrid({ images }: { images: Img[] }) {
  if (images.length === 0) return null;

  return (
    <div className="mb-6 flex max-w-lg flex-wrap gap-3">
      {images.map((img, i) => (
        <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded border border-neutral-200">
          <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
          <button
            type="button"
            onClick={() => deleteProductImage(img.id)}
            className="absolute right-0.5 top-0.5 rounded bg-black/60 px-1 text-xs text-white"
          >
            ✕
          </button>
          <div className="absolute bottom-0.5 left-0.5 flex gap-0.5">
            {i > 0 && (
              <button
                type="button"
                onClick={() => reorderProductImage(img.id, "up")}
                aria-label="Move earlier"
                className="rounded bg-black/60 px-1 text-xs text-white"
              >
                ‹
              </button>
            )}
            {i < images.length - 1 && (
              <button
                type="button"
                onClick={() => reorderProductImage(img.id, "down")}
                aria-label="Move later"
                className="rounded bg-black/60 px-1 text-xs text-white"
              >
                ›
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
