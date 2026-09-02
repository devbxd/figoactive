"use client";

import { useActionState, useState } from "react";
import { VariantsEditor } from "./VariantsEditor";
import { uploadFileDirect } from "@/lib/storage/uploadClient";

type Category = { id: string; name: string };

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number | null;
  compare_at_price: number | null;
  category_id: string | null;
  is_active?: boolean;
  stock?: number | null;
  is_featured?: boolean;
  tags?: string[];
  variants?: {
    color_label: string | null;
    size_label: string | null;
    price: number | null;
    compare_at_price?: number | null;
    stock?: number | null;
    available: boolean;
  }[];
};

export function ProductForm({
  action,
  categories,
  product,
  submitLabel,
  otherProducts,
  relatedProductIds,
}: {
  action: (formData: FormData) => Promise<unknown>;
  categories: Category[];
  product?: Product;
  submitLabel: string;
  otherProducts?: { id: string; name: string }[];
  relatedProductIds?: string[];
}) {
  // create() still redirects on success, so this only ever resolves to true
  // for update() — which stays on the page instead of navigating away.
  const [saved, dispatch, isSaving] = useActionState(async (_prev: boolean, formData: FormData) => {
    await action(formData);
    return true;
  }, false);

  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compare_at_price?.toString() ?? "");
  const priceNum = Number(price);
  const compareAtNum = Number(compareAtPrice);
  const hasDiscount = price && compareAtPrice && compareAtNum > priceNum;
  const percentOff = hasDiscount ? Math.round((1 - priceNum / compareAtNum) * 100) : 0;

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Photos upload straight from the browser to Supabase Storage before the
  // rest of the form is submitted as a Server Action — routing the raw
  // file through the action instead hits request-size limits on Netlify
  // (and similar hosts) well below a real phone photo.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    const formData = new FormData(e.currentTarget);
    const files = (formData.getAll("images") as File[]).filter((file) => file && file.size > 0);
    formData.delete("images");

    if (files.length > 0) {
      setUploading(true);
      try {
        for (const file of files) {
          const url = await uploadFileDirect("products", "products", file);
          formData.append("image_url", url);
        }
      } catch (err) {
        setUploading(false);
        setUploadError(err instanceof Error ? err.message : "Photo upload failed. Please try again.");
        return;
      }
      setUploading(false);
    }

    dispatch(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Discount: original price (optional)</label>
          <input
            name="compare_at_price"
            type="number"
            step="0.01"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            placeholder="e.g. 65.00"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      </div>

      {hasDiscount && (
        <p className="-mt-2 text-xs text-emerald-700">
          On sale: <span className="line-through">${compareAtNum.toFixed(2)}</span> → ${priceNum.toFixed(2)} (
          -{percentOff}%) will show on the site.
        </p>
      )}

      <VariantsEditor initial={product?.variants ?? []} />

      {(product?.variants?.length ?? 0) === 0 && (
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Stock (blank = untracked, always in stock)</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? ""}
            className="w-full max-w-[10rem] border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Tags (comma-separated, e.g. New, Bestseller)</label>
        <input
          name="tags"
          defaultValue={product?.tags?.join(", ")}
          placeholder="New, Bestseller, Last pieces"
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} />
        Featured on the homepage
      </label>

      {otherProducts && otherProducts.length > 0 && (
        <div>
          <label className="mb-1 block text-sm text-neutral-600">
            Related products (shown as &quot;You may also like&quot; — leave empty to fall back to same category)
          </label>
          <div className="max-h-48 max-w-lg overflow-y-auto border border-neutral-300 p-2">
            {otherProducts.map((p) => (
              <label key={p.id} className="flex items-center gap-2 py-1 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  name="related_product_id"
                  value={p.id}
                  defaultChecked={relatedProductIds?.includes(p.id) ?? false}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>
      )}

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
        <input name="images" type="file" accept="image/*" multiple className="w-full text-sm" disabled={uploading} />
        {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
      </div>

      {product && (
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" name="is_active" defaultChecked={product.is_active ?? true} />
          Visible on the site
        </label>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={uploading || isSaving}
          className="bg-brand-navy px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? "Uploading photos…" : isSaving ? "Saving…" : submitLabel}
        </button>
        {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
      </div>
    </form>
  );
}
