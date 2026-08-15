"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const cart = useCart();

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

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
        <p className="font-heading text-sm uppercase tracking-wide text-neutral-500">Subtotal</p>
        <p className="text-lg font-semibold text-brand-navy">${cart.subtotal.toFixed(2)}</p>
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
