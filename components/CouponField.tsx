"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { previewCoupon } from "@/app/cart/actions";

type Discount = { discountAmount: number; freeShipping: boolean } | null;

export function CouponField({ subtotal, onChange }: { subtotal: number; onChange: (discount: Discount) => void }) {
  const { couponCode, setCouponCode } = useCart();
  const [input, setInput] = useState(couponCode ?? "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!couponCode) {
      onChange(null);
      return;
    }
    let cancelled = false;
    previewCoupon(couponCode, subtotal).then((r) => {
      if (cancelled) return;
      if (r.valid) {
        onChange({ discountAmount: r.discountAmount, freeShipping: r.freeShipping });
        setMessage({ ok: true, text: r.freeShipping ? "Free shipping applied" : `-$${r.discountAmount.toFixed(2)} applied` });
      } else {
        onChange(null);
        setMessage({ ok: false, text: r.reason });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode, subtotal]);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setChecking(true);
    const r = await previewCoupon(input, subtotal);
    setChecking(false);
    if (r.valid) {
      setCouponCode(input.trim());
      onChange({ discountAmount: r.discountAmount, freeShipping: r.freeShipping });
      setMessage({ ok: true, text: r.freeShipping ? "Free shipping applied" : `-$${r.discountAmount.toFixed(2)} applied` });
    } else {
      setMessage({ ok: false, text: r.reason });
    }
  }

  function remove() {
    setCouponCode(null);
    setInput("");
    setMessage(null);
    onChange(null);
  }

  return (
    <div>
      <form onSubmit={apply} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Discount code"
          className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2 text-sm uppercase focus:border-brand-navy focus:outline-none"
        />
        {couponCode ? (
          <button
            type="button"
            onClick={remove}
            className="shrink-0 border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wide text-neutral-600 hover:border-red-400 hover:text-red-600"
          >
            Remove
          </button>
        ) : (
          <button
            type="submit"
            disabled={checking}
            className="shrink-0 border border-brand-navy px-4 py-2 text-xs uppercase tracking-wide text-brand-navy hover:bg-brand-navy hover:text-white disabled:opacity-50"
          >
            {checking ? "..." : "Apply"}
          </button>
        )}
      </form>
      {message && <p className={`mt-1.5 text-xs ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>}
    </div>
  );
}
