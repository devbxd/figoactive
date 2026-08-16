"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { VariantsEditor } from "./VariantsEditor";

type Category = { id: string; name: string };

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number | null;
  compare_at_price: number | null;
  category_id: string | null;
  is_active?: boolean;
  variants?: {
    color_label: string | null;
    size_label: string | null;
    price: number | null;
    available: boolean;
  }[];
};

export function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<unknown>;
  categories: Category[];
  product?: Product;
  submitLabel: string;
}) {
  // create() still redirects on success, so this only ever resolves to true
  // for update() — which stays on the page instead of navigating away.
  const [saved, dispatch] = useActionState(async (_prev: boolean, formData: FormData) => {
    await action(formData);
    return true;
  }, false);

  return (
    <form action={dispatch} encType="multipart/form-data" className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm text-neutral-600">Product name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Category</label>
        <select
          name="category_id"
          defaultValue={product?.category_id ?? ""}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Price (USD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={product?.price ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Compare-at price (optional, shows a sale badge)</label>
          <input
            name="compare_at_price"
            type="number"
            step="0.01"
            defaultValue={product?.compare_at_price ?? ""}
            placeholder="e.g. 65.00"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      </div>

      <VariantsEditor initial={product?.variants ?? []} />

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Description</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={product?.description}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">{product ? "Add more photos" : "Photos"}</label>
        <input name="images" type="file" accept="image/*" multiple className="w-full text-sm" />
      </div>

      {product && (
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" name="is_active" defaultChecked={product.is_active ?? true} />
          Visible on the site
        </label>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton className="bg-brand-navy px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:opacity-90">
          {submitLabel}
        </SubmitButton>
        {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
      </div>
    </form>
  );
}
