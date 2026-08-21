"use client";

import { useState } from "react";
import { CouponForm, type CouponValues } from "./CouponForm";
import { updateCoupon, toggleCouponActive, deleteCoupon } from "./actions";

type Coupon = CouponValues & { id: string; times_used: number; is_active: boolean };

function describe(c: Coupon) {
  if (c.discount_type === "free_shipping") return "Free shipping";
  if (c.discount_type === "percent") return `${c.value}% off`;
  return `$${c.value} off`;
}

export function CouponRow({ coupon }: { coupon: Coupon }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="border-b border-neutral-100 py-4">
        <CouponForm
          action={updateCoupon.bind(null, coupon.id)}
          initial={coupon}
          submitLabel="Save"
          onDone={() => setEditing(false)}
        />
      </div>
    );
  }

  const now = new Date();
  const expired = coupon.ends_at && new Date(coupon.ends_at) < now;
  const limitReached = coupon.usage_limit != null && coupon.times_used >= coupon.usage_limit;

  return (
    <div className="flex flex-col gap-2 border-b border-neutral-100 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {coupon.is_automatic ? (
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs uppercase text-neutral-600">Automatic</span>
          ) : (
            <span className="font-mono">{coupon.code}</span>
          )}{" "}
          — {describe(coupon)}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">
          {coupon.times_used} used{coupon.usage_limit != null ? ` / ${coupon.usage_limit}` : ""}
          {coupon.min_subtotal != null ? ` · min $${coupon.min_subtotal}` : ""}
          {coupon.ends_at ? ` · ends ${new Date(coupon.ends_at).toLocaleDateString()}` : ""}
          {expired && <span className="ml-1 text-red-600">(expired)</span>}
          {limitReached && <span className="ml-1 text-red-600">(limit reached)</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-sm">
        <form action={toggleCouponActive.bind(null, coupon.id, !coupon.is_active)}>
          <button className={coupon.is_active ? "text-emerald-700" : "text-neutral-400"}>
            {coupon.is_active ? "Active" : "Inactive"}
          </button>
        </form>
        <button className="text-neutral-600 hover:text-brand-navy" onClick={() => setEditing(true)}>
          Edit
        </button>
        <form
          action={async () => {
            if (!confirm("Delete this coupon?")) return;
            await deleteCoupon(coupon.id);
          }}
        >
          <button className="text-neutral-600 hover:text-red-600">Delete</button>
        </form>
      </div>
    </div>
  );
}
