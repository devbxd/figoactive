"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { validateCouponCode, getActiveAutomaticCoupon, incrementCouponUsage } from "@/lib/coupons";
import { getShippingZones, getPaymentMethods } from "@/lib/settings";
import { LOW_STOCK_THRESHOLD } from "@/lib/site";

type CheckoutItem = {
  productId: string;
  variantId: string | null;
  variant: string | null;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutInput = {
  name: string;
  phone: string;
  address: string;
  city: string;
  shippingZoneId: string;
  paymentMethodId: string;
  couponCode: string | null;
  items: CheckoutItem[];
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function getCheckoutOptions() {
  const [zones, methods] = await Promise.all([getShippingZones(), getPaymentMethods()]);
  return { zones, methods };
}

export async function submitOrder(input: CheckoutInput) {
  if (!input.name || !input.phone || !input.address || input.items.length === 0) {
    throw new Error("Missing required checkout fields");
  }

  const supabase = createServiceClient();

  const [{ data: zone }, { data: method }] = await Promise.all([
    supabase.from("shipping_zones").select("label, cost").eq("id", input.shippingZoneId).eq("is_active", true).maybeSingle(),
    supabase.from("payment_methods").select("label").eq("id", input.paymentMethodId).eq("is_active", true).maybeSingle(),
  ]);

  if (!zone) throw new Error("Invalid shipping zone");

  const subtotal = round2(input.items.reduce((a, i) => a + i.price * i.quantity, 0));

  const couponResult = input.couponCode
    ? await validateCouponCode(input.couponCode, subtotal)
    : await getActiveAutomaticCoupon(subtotal);

  const discountAmount = couponResult?.valid ? couponResult.discountAmount : 0;
  const freeShipping = couponResult?.valid ? couponResult.freeShipping : false;
  const shippingCost = freeShipping ? 0 : Number(zone.cost);
  const total = Math.max(0, round2(subtotal - discountAmount + shippingCost));

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      name: input.name,
      phone: input.phone,
      address: input.address,
      city: input.city,
      shipping_zone_label: zone.label,
      shipping_cost: shippingCost,
      payment_method: method?.label ?? "Cash on delivery",
      subtotal,
      discount_amount: discountAmount,
      coupon_code: couponResult?.valid ? couponResult.coupon.code : null,
      total,
    })
    .select("id")
    .single();

  if (error || !order) throw error;

  await supabase.from("order_items").insert(
    input.items.map((i, idx) => ({
      order_id: order.id,
      product_id: i.productId,
      variant_id: i.variantId,
      name: i.name,
      variant_label: i.variant,
      price: i.price,
      quantity: i.quantity,
      sort_order: idx,
    }))
  );

  if (couponResult?.valid) {
    await incrementCouponUsage(couponResult.coupon.id);
  }

  const lowStockItems: { name: string; stock: number }[] = [];
  for (const item of input.items) {
    const { data: newStock } = item.variantId
      ? await supabase.rpc("decrement_variant_stock", { p_variant_id: item.variantId, p_qty: item.quantity })
      : await supabase.rpc("decrement_product_stock", { p_product_id: item.productId, p_qty: item.quantity });
    if (typeof newStock === "number" && newStock <= LOW_STOCK_THRESHOLD) {
      lowStockItems.push({ name: `${item.name}${item.variant ? ` (${item.variant})` : ""}`, stock: newStock });
    }
  }

  try {
    const { notifyNewOrder } = await import("@/lib/notify-order");
    await notifyNewOrder({
      orderId: order.id,
      name: input.name,
      phone: input.phone,
      address: input.address,
      city: input.city,
      shippingZone: zone.label,
      total,
      discountAmount,
      couponCode: couponResult?.valid ? couponResult.coupon.code : null,
      items: input.items.map((i) => ({ name: i.name, variant: i.variant, price: i.price, quantity: i.quantity })),
      lowStockItems,
    });
  } catch {
    // notification failure must never block the customer's order from succeeding
  }

  return { orderId: order.id as string, total, discountAmount, shippingCost };
}
