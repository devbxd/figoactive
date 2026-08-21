"use client";

import { useState } from "react";

type VariantRow = {
  key: string;
  color: string;
  size: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  available: boolean;
};

type VariantData = {
  color_label: string | null;
  size_label: string | null;
  price: number | null;
  compare_at_price?: number | null;
  stock?: number | null;
  available: boolean;
};

function emptyRow(): VariantRow {
  return { key: crypto.randomUUID(), color: "", size: "", price: "", compareAtPrice: "", stock: "", available: true };
}

export function VariantsEditor({ initial }: { initial: VariantData[] }) {
  const [rows, setRows] = useState<VariantRow[]>(
    initial.length > 0
      ? initial.map((v) => ({
          key: crypto.randomUUID(),
          color: v.color_label ?? "",
          size: v.size_label ?? "",
          price: v.price?.toString() ?? "",
          compareAtPrice: v.compare_at_price?.toString() ?? "",
          stock: v.stock != null ? v.stock.toString() : "",
          available: v.available,
        }))
      : []
  );

  function update(key: string, patch: Partial<VariantRow>) {
    setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm text-neutral-600">Color / size options (leave empty if none)</label>
        <button
          type="button"
          onClick={() => setRows((r) => [...r, emptyRow()])}
          className="text-xs uppercase tracking-wide text-brand-navy hover:underline"
        >
          + Add option
        </button>
      </div>
      <p className="mb-2 text-xs text-neutral-500">
        Fill in whichever of Color / Size apply for each combination customers can pick — leave the other blank.
      </p>

      <div className="space-y-2">
        {rows.map((row) => {
          const price = Number(row.price);
          const compareAt = Number(row.compareAtPrice);
          const hasDiscount = row.price && row.compareAtPrice && compareAt > price;
          const percentOff = hasDiscount ? Math.round((1 - price / compareAt) * 100) : 0;

          return (
            <div key={row.key} className="flex flex-wrap items-center gap-2 border border-neutral-200 p-2">
              <input type="hidden" name="variant_key" value={row.key} />
              <input
                name="variant_color"
                value={row.color}
                onChange={(e) => update(row.key, { color: e.target.value })}
                placeholder="Color (e.g. Black)"
                className="w-32 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
              />
              <input
                name="variant_size"
                value={row.size}
                onChange={(e) => update(row.key, { size: e.target.value })}
                placeholder="Size (e.g. M)"
                className="w-24 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
              />
              <input
                name="variant_price"
                type="number"
                step="0.01"
                value={row.price}
                onChange={(e) => update(row.key, { price: e.target.value })}
                placeholder="Price override"
                className="w-28 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
              />
              <input
                name="variant_compare_at_price"
                type="number"
                step="0.01"
                value={row.compareAtPrice}
                onChange={(e) => update(row.key, { compareAtPrice: e.target.value })}
                placeholder="Discount: was $..."
                className="w-32 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
              />
              {hasDiscount && (
                <span className="rounded-full bg-brand-mint px-2 py-0.5 text-[10px] font-bold uppercase text-brand-navy">
                  -{percentOff}%
                </span>
              )}
              <input
                name="variant_stock"
                type="number"
                min="0"
                value={row.stock}
                onChange={(e) => update(row.key, { stock: e.target.value })}
                placeholder="Stock (blank = untracked)"
                className="w-40 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
              />
              <label className="flex items-center gap-1.5 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  name="variant_available"
                  value={row.key}
                  checked={row.available}
                  onChange={(e) => update(row.key, { available: e.target.checked })}
                />
                In stock
              </label>
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((r2) => r2.key !== row.key))}
                className="ml-auto px-2 text-neutral-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
