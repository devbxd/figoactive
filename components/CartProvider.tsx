"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { trackPixelEvent } from "@/lib/pixel";

export type CartItem = {
  slug: string;
  variant: string | null;
  productId: string;
  variantId: string | null;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string, variant: string | null) => void;
  setQuantity: (slug: string, variant: string | null, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "figo-active-cart";
const COUPON_STORAGE_KEY = "figo-active-coupon";

function sameLine(a: { slug: string; variant: string | null }, b: { slug: string; variant: string | null }) {
  return a.slug === b.slug && (a.variant ?? "") === (b.variant ?? "");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCodeState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const code = localStorage.getItem(COUPON_STORAGE_KEY);
      if (code) setCouponCodeState(code);
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const setCouponCode = useCallback((code: string | null) => {
    setCouponCodeState(code);
    try {
      if (code) localStorage.setItem(COUPON_STORAGE_KEY, code);
      else localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item));
      if (existing) {
        return prev.map((i) => (sameLine(i, item) ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, quantity }];
    });
    trackPixelEvent("AddToCart", {
      content_ids: [item.slug],
      content_name: item.name,
      value: item.price * quantity,
      currency: "USD",
    });
  }, []);

  const removeItem = useCallback((slug: string, variant: string | null) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, { slug, variant })));
  }, []);

  const setQuantity = useCallback((slug: string, variant: string | null, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !sameLine(i, { slug, variant }))
        : prev.map((i) => (sameLine(i, { slug, variant }) ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCouponCode(null);
  }, [setCouponCode]);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clear, count, subtotal, couponCode, setCouponCode }),
    [items, addItem, removeItem, setQuantity, clear, count, subtotal, couponCode, setCouponCode]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
