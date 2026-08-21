"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { CouponField } from "@/components/CouponField";

export default function CartPage() {
  const cart = useCart();
  const [discount, setDiscount] = useState<{ discountAmount: number; freeShipping: boolean } | null>(null);

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-brand-navy px-8 py-3 font-heading text-sm uppercase tracking-widest text-white hover:opacity-90"
        >
          Shop now
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Your cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={`${item.slug}-${item.variant ?? ""}`} className="flex gap-4 border-b border-neutral-200 pb-4">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-brand-cream">
              {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-heading text-sm uppercase tracking-wide text-brand-navy">{item.name}</p>
              {item.variant && <p className="text-xs text-neutral-500">{item.variant}</p>}
              <p className="mt-1 text-sm font-semibold text-brand-navy">${item.price.toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => cart.setQuantity(item.slug, item.variant, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-neutral-600"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => cart.setQuantity(item.slug, item.variant, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-neutral-600"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => cart.removeItem(item.slug, item.variant)}
                  className="text-xs uppercase tracking-wide text-neutral-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-4">
        <CouponField subtotal={cart.subtotal} onChange={setDiscount} />
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <p>Subtotal</p>
          <p>${cart.subtotal.toFixed(2)}</p>
        </div>
        {discount && discount.discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-emerald-700">
            <p>Discount</p>
            <p>-${discount.discountAmount.toFixed(2)}</p>
          </div>
        )}
        {discount?.freeShipping && (
          <div className="flex items-center justify-between text-sm text-emerald-700">
            <p>Shipping</p>
            <p>Free</p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-1.5">
          <p className="font-heading text-sm uppercase tracking-wide text-neutral-500">Total</p>
          <p className="text-lg font-semibold text-brand-navy">
            ${Math.max(0, cart.subtotal - (discount?.discountAmount ?? 0)).toFixed(2)}
            <span className="ml-1 text-xs font-normal text-neutral-400">+ shipping</span>
          </p>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full bg-brand-navy py-3.5 text-center font-heading text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90"
      >
        Checkout
      </Link>
    </main>
  );
}
