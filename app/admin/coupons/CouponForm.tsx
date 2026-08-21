"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

export type CouponValues = {
  code: string | null;
  discount_type: "percent" | "fixed" | "free_shipping";
  value: number;
  min_subtotal: number | null;
  usage_limit: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_automatic: boolean;
};

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CouponForm({
  action,
  initial,
  submitLabel,
  onDone,
}: {
  action: (formData: FormData) => Promise<unknown>;
  initial?: CouponValues;
  submitLabel: string;
  onDone?: () => void;
}) {
  const [isAutomatic, setIsAutomatic] = useState(initial?.is_automatic ?? false);
  const [discountType, setDiscountType] = useState(initial?.discount_type ?? "percent");

  async function handleSubmit(formData: FormData) {
    await action(formData);
    onDone?.();
  }

  return (
    <form
      action={handleSubmit}
      className="grid max-w-2xl grid-cols-1 gap-3 border border-neutral-200 bg-white p-4 sm:grid-cols-2"
    >
      <label className="col-span-full flex items-center gap-2 text-sm text-neutral-600">
        <input
          type="checkbox"
          name="is_automatic"
          checked={isAutomatic}
          onChange={(e) => setIsAutomatic(e.target.checked)}
        />
        Apply automatically at checkout (no code needed)
      </label>

      {!isAutomatic && (
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Code</label>
          <input
            name="code"
            required={!isAutomatic}
            defaultValue={initial?.code ?? ""}
            placeholder="SAVE10"
            className="w-full border border-neutral-300 px-3 py-2 text-sm uppercase focus:border-brand-navy focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Discount type</label>
        <select
          name="discount_type"
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as typeof discountType)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        >
          <option value="percent">Percent off</option>
          <option value="fixed">Fixed amount off</option>
          <option value="free_shipping">Free shipping</option>
        </select>
      </div>

      {discountType !== "free_shipping" && (
        <div>
          <label className="mb-1 block text-sm text-neutral-600">
            Value {discountType === "percent" ? "(%)" : "($)"}
          </label>
          <input
            name="value"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.value ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Minimum order (optional)</label>
        <input
          name="min_subtotal"
          type="number"
          step="0.01"
          min="0"
          defaultValue={initial?.min_subtotal ?? ""}
          placeholder="e.g. 50.00"
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Usage limit (optional)</label>
        <input
          name="usage_limit"
          type="number"
          min="0"
          defaultValue={initial?.usage_limit ?? ""}
          placeholder="e.g. 100"
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Starts (optional)</label>
        <input
          name="starts_at"
          type="datetime-local"
          defaultValue={toLocalInput(initial?.starts_at ?? null)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-neutral-600">Ends (optional)</label>
        <input
          name="ends_at"
          type="datetime-local"
          defaultValue={toLocalInput(initial?.ends_at ?? null)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
      </div>

      <div className="col-span-full flex items-center gap-3">
        <SubmitButton className="bg-brand-navy px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:opacity-90">
          {submitLabel}
        </SubmitButton>
        {onDone && (
          <button type="button" onClick={onDone} className="text-sm text-neutral-500 hover:text-neutral-800">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
