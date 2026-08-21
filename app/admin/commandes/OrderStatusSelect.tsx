"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const COLORS: Record<string, string> = {
  pending: "text-neutral-600",
  confirmed: "text-blue-700",
  shipped: "text-purple-700",
  delivered: "text-emerald-700",
  cancelled: "text-red-600",
};

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as (typeof STATUSES)[number];
        setValue(next);
        startTransition(() => {
          updateOrderStatus(orderId, next);
        });
      }}
      className={`border border-neutral-300 bg-white px-2 py-1 text-xs uppercase tracking-wide focus:border-brand-navy focus:outline-none ${COLORS[value] ?? ""}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
