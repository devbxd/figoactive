"use client";

import { useEffect, useRef, useState } from "react";

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"];

const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Navy", hex: "#1D2236" },
  { name: "Beige", hex: "#E8DCC8" },
  { name: "Nude", hex: "#D9B99B" },
  { name: "Brown", hex: "#6B4A2F" },
  { name: "Red", hex: "#DC2626" },
  { name: "Burgundy", hex: "#7C2D3E" },
  { name: "Pink", hex: "#F4A6C1" },
  { name: "Purple", hex: "#7C3AED" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Sky Blue", hex: "#38BDF8" },
  { name: "Green", hex: "#16A34A" },
  { name: "Khaki", hex: "#A3A380" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Orange", hex: "#F97316" },
];

function colorHex(name: string) {
  return COLOR_PRESETS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.hex ?? "#D4D4D4";
}

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

function makeRow(color: string, size: string, patch?: Partial<VariantRow>): VariantRow {
  return { key: crypto.randomUUID(), color, size, price: "", compareAtPrice: "", stock: "", available: true, ...patch };
}

function comboKey(color: string, size: string) {
  return `${color} ${size}`;
}

function Chip({ label, selected, onClick, swatch }: { label: string; selected: boolean; onClick: () => void; swatch?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-medium ${
        selected ? "border-brand-navy bg-brand-navy text-white" : "border-neutral-300 text-neutral-600 hover:border-brand-navy"
      }`}
    >
      {swatch && (
        <span
          className="h-3 w-3 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: swatch }}
        />
      )}
      {label}
    </button>
  );
}

export function VariantsEditor({ initial }: { initial: VariantData[] }) {
  const [rows, setRows] = useState<VariantRow[]>(() =>
    initial.map((v) =>
      makeRow(v.color_label ?? "", v.size_label ?? "", {
        price: v.price?.toString() ?? "",
        compareAtPrice: v.compare_at_price?.toString() ?? "",
        stock: v.stock != null ? v.stock.toString() : "",
        available: v.available,
      })
    )
  );

  const [selectedSizes, setSelectedSizes] = useState<string[]>(() =>
    Array.from(new Set(initial.map((v) => v.size_label).filter(Boolean) as string[]))
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(() =>
    Array.from(new Set(initial.map((v) => v.color_label).filter(Boolean) as string[]))
  );
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [customColor, setCustomColor] = useState("");

  // Skip the first run so mounting doesn't rebuild (and lose price/stock
  // from) the rows we just loaded from `initial`.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setRows((prevRows) => {
      const existing = new Map(prevRows.map((r) => [comboKey(r.color, r.size), r]));
      const combos: { color: string; size: string }[] =
        selectedSizes.length > 0 && selectedColors.length > 0
          ? selectedColors.flatMap((color) => selectedSizes.map((size) => ({ color, size })))
          : selectedSizes.length > 0
          ? selectedSizes.map((size) => ({ color: "", size }))
          : selectedColors.length > 0
          ? selectedColors.map((color) => ({ color, size: "" }))
          : [];
      return combos.map(({ color, size }) => existing.get(comboKey(color, size)) ?? makeRow(color, size));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSizes, selectedColors]);

  function toggleSize(size: string) {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  function toggleColor(color: string) {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  }

  function addCustomColor() {
    const name = customColor.trim();
    if (!name || selectedColors.some((c) => c.toLowerCase() === name.toLowerCase())) return;
    setSelectedColors((prev) => [...prev, name]);
    setCustomColor("");
  }

  function updateRow(key: string, patch: Partial<VariantRow>) {
    setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  const extraSizeChips = selectedSizes.filter((s) => !SIZE_PRESETS.includes(s));
  const extraColorChips = selectedColors.filter((c) => !COLOR_PRESETS.some((p) => p.name.toLowerCase() === c.toLowerCase()));

  return (
    <div>
      <label className="mb-1 block text-sm text-neutral-600">Options (leave both empty if the product has none)</label>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSizePickerOpen((o) => !o)}
          className={`border px-4 py-2 text-xs uppercase tracking-wide ${
            sizePickerOpen || selectedSizes.length > 0 ? "border-brand-navy text-brand-navy" : "border-neutral-300 text-neutral-600"
          }`}
        >
          Size {selectedSizes.length > 0 && `(${selectedSizes.length})`}
        </button>
        <button
          type="button"
          onClick={() => setColorPickerOpen((o) => !o)}
          className={`border px-4 py-2 text-xs uppercase tracking-wide ${
            colorPickerOpen || selectedColors.length > 0 ? "border-brand-navy text-brand-navy" : "border-neutral-300 text-neutral-600"
          }`}
        >
          Color {selectedColors.length > 0 && `(${selectedColors.length})`}
        </button>
      </div>

      {sizePickerOpen && (
        <div className="mb-3 border border-neutral-200 p-3">
          <p className="mb-2 text-xs text-neutral-500">Click every size this product comes in.</p>
          <div className="flex flex-wrap gap-2">
            {[...SIZE_PRESETS, ...extraSizeChips].map((size) => (
              <Chip key={size} label={size} selected={selectedSizes.includes(size)} onClick={() => toggleSize(size)} />
            ))}
          </div>
        </div>
      )}

      {colorPickerOpen && (
        <div className="mb-3 border border-neutral-200 p-3">
          <p className="mb-2 text-xs text-neutral-500">Click every color this product comes in.</p>
          <div className="flex flex-wrap gap-2">
            {[...COLOR_PRESETS.map((c) => c.name), ...extraColorChips].map((color) => (
              <Chip
                key={color}
                label={color}
                selected={selectedColors.includes(color)}
                onClick={() => toggleColor(color)}
                swatch={colorHex(color)}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomColor();
                }
              }}
              placeholder="Other color name…"
              className="border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
            />
            <button type="button" onClick={addCustomColor} className="text-xs uppercase tracking-wide text-brand-navy hover:underline">
              + Add
            </button>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((row) => {
            const price = Number(row.price);
            const compareAt = Number(row.compareAtPrice);
            const hasDiscount = row.price && row.compareAtPrice && compareAt > price;
            const percentOff = hasDiscount ? Math.round((1 - price / compareAt) * 100) : 0;

            return (
              <div key={row.key} className="flex flex-wrap items-center gap-2 border border-neutral-200 p-2">
                <input type="hidden" name="variant_key" value={row.key} />
                <input type="hidden" name="variant_color" value={row.color} />
                <input type="hidden" name="variant_size" value={row.size} />
                <span className="flex min-w-[7rem] items-center gap-1.5 text-sm font-medium">
                  {row.color && (
                    <span className="h-3 w-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: colorHex(row.color) }} />
                  )}
                  {[row.color, row.size].filter(Boolean).join(" / ")}
                </span>
                <input
                  name="variant_price"
                  type="number"
                  step="0.01"
                  value={row.price}
                  onChange={(e) => updateRow(row.key, { price: e.target.value })}
                  placeholder="Price override"
                  className="w-28 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
                />
                <input
                  name="variant_compare_at_price"
                  type="number"
                  step="0.01"
                  value={row.compareAtPrice}
                  onChange={(e) => updateRow(row.key, { compareAtPrice: e.target.value })}
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
                  onChange={(e) => updateRow(row.key, { stock: e.target.value })}
                  placeholder="Stock (blank = untracked)"
                  className="w-40 border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
                />
                <label className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    name="variant_available"
                    value={row.key}
                    checked={row.available}
                    onChange={(e) => updateRow(row.key, { available: e.target.checked })}
                  />
                  In stock
                </label>
                <button
                  type="button"
                  onClick={() => setRows((r) => r.filter((r2) => r2.key !== row.key))}
                  aria-label="Remove this combination"
                  className="ml-auto px-2 text-neutral-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            );
          })}
          <p className="text-xs text-neutral-400">
            ✕ removes just that one combination — toggling a Size/Color button above rebuilds the full grid.
          </p>
        </div>
      )}
    </div>
  );
}
