"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { submitOrder } from "./actions";
import { SHIPPING_COST, whatsappLink } from "@/lib/site";

type ConfirmedOrder = {
  name: string;
  phone: string;
  address: string;
  city: string;
  shippingZone: "beirut" | "outside_beirut";
  shippingCost: number;
  items: { name: string; variant: string | null; quantity: number; price: number }[];
  subtotal: number;
  total: number;
};

function buildWhatsAppOrderMessage(orderId: string, o: ConfirmedOrder) {
  const itemsText = o.items
    .map((i) => `${i.quantity}x ${i.name}${i.variant ? ` (${i.variant})` : ""} — $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  const lines = [
    `Hi! I just placed an order (#${orderId.slice(0, 8)}) on the website:`,
    "",
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    `Address: ${o.address}, ${o.city}`,
    "",
    itemsText,
    "",
    `Subtotal: $${o.subtotal.toFixed(2)}`,
    `Shipping (${o.shippingZone === "beirut" ? "Beirut" : "Outside Beirut"}): $${o.shippingCost.toFixed(2)}`,
    `Total: $${o.total.toFixed(2)}`,
    "Payment: Cash on delivery",
  ];

  return lines.join("\n");
}

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [shippingZone, setShippingZone] = useState<"beirut" | "outside_beirut">("beirut");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<ConfirmedOrder | null>(null);

  const shippingCost = SHIPPING_COST[shippingZone];
  const total = cart.subtotal + shippingCost;

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { orderId } = await submitOrder({
        ...form,
        paymentMethod: "cod",
        shippingZone,
        shippingCost,
        items: cart.items.map((i) => ({ variant: i.variant, name: i.name, price: i.price, quantity: i.quantity })),
      });
      setConfirmedOrderId(orderId);
      setConfirmedSnapshot({
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        shippingZone,
        shippingCost,
        items: cart.items.map((i) => ({ name: i.name, variant: i.variant, quantity: i.quantity, price: i.price })),
        subtotal: cart.subtotal,
        total,
      });
      cart.clear();
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (ready && cart.items.length === 0 && !confirmedOrderId) {
    router.replace("/cart");
    return null;
  }

  if (confirmedOrderId && confirmedSnapshot) {
    return (
      <main className="bg-brand-cream px-4 py-20 text-center md:px-6">
        <div className="mx-auto max-w-lg">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Order received!</h1>
          <p className="mt-4 text-sm text-neutral-600">
            Reference: <span className="font-mono">{confirmedOrderId.slice(0, 8)}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            We&apos;ll reach out on WhatsApp or by phone shortly to confirm your order. Tap below to send it to us
            on WhatsApp too, for the fastest confirmation.
          </p>
          <a
            href={whatsappLink(buildWhatsAppOrderMessage(confirmedOrderId, confirmedSnapshot))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-full bg-green-600 py-3 text-center font-heading text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90"
          >
            Send it via WhatsApp too
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-cream px-4 py-12 md:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-600">Phone</label>
            <input
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-600">Address</label>
            <input
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-600">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-600">Shipping</label>
            <div className="space-y-2">
              {(
                [
                  { value: "beirut", label: "Beirut", cost: SHIPPING_COST.beirut },
                  { value: "outside_beirut", label: "Outside Beirut", cost: SHIPPING_COST.outside_beirut },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center justify-between border bg-white px-4 py-3 text-sm ${
                    shippingZone === opt.value ? "border-brand-navy" : "border-neutral-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingZone"
                      checked={shippingZone === opt.value}
                      onChange={() => setShippingZone(opt.value)}
                    />
                    {opt.label}
                  </span>
                  <span>${opt.cost.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-600">
            Payment: Cash on delivery
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="space-y-1 border-t border-neutral-300 pt-4">
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <p>Subtotal</p>
              <p>${cart.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <p>Shipping</p>
              <p>${shippingCost.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-heading text-sm uppercase tracking-wide text-neutral-500">Total</p>
              <p className="text-lg font-semibold text-brand-navy">${total.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-navy py-3.5 text-center font-heading text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>
      </div>
    </main>
  );
}
