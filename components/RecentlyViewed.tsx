"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const STORAGE_KEY = "figo-active-recently-viewed";
const MAX_ITEMS = 8;

type RecentItem = { slug: string; name: string; price: number; image: string | null };

export function RecentlyViewed({ record, exclude }: { record?: RecentItem; exclude?: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    let list: RecentItem[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) list = JSON.parse(raw);
    } catch {
      // ignore corrupted storage
    }

    if (record) {
      list = [record, ...list.filter((i) => i.slug !== record.slug)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    setItems(list.filter((i) => i.slug !== exclude));
  }, [record, exclude]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10">
      <h2 className="mb-8 text-center font-heading text-xl font-bold uppercase tracking-wide text-brand-navy">
        Recently viewed
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <Link key={p.slug} href={`/shop/${p.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <p className="mt-3 font-heading text-sm uppercase tracking-wide text-brand-navy">{p.name}</p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">${p.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
