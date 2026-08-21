// Shared coupon validation — used by the cart's "Apply" preview action and
// (authoritatively, ignoring whatever the client sent) by checkout when the
// order is actually placed. Never trust a discount amount coming from the
// browser: always recompute it here from the coupon row.
import { createServiceClient } from "@/lib/supabase/server";

export type CouponRow = {
  id: string;
  code: string | null;
  discount_type: "percent" | "fixed" | "free_shipping";
  value: number;
  min_subtotal: number | null;
  usage_limit: number | null;
  times_used: number;
  starts_at: string | null;
  ends_at: string | null;
  is_automatic: boolean;
  is_active: boolean;
};

export type CouponResult =
  | { valid: true; coupon: CouponRow; discountAmount: number; freeShipping: boolean }
  | { valid: false; reason: string };

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function usageError(coupon: CouponRow, subtotal: number, now: Date): string | null {
  if (!coupon.is_active) return "This code is no longer active.";
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return "This code isn't active yet.";
  if (coupon.ends_at && new Date(coupon.ends_at) < now) return "This code has expired.";
  if (coupon.usage_limit != null && coupon.times_used >= coupon.usage_limit) return "This code has reached its usage limit.";
  if (coupon.min_subtotal != null && subtotal < coupon.min_subtotal) {
    return `This code needs a minimum order of $${Number(coupon.min_subtotal).toFixed(2)}.`;
  }
  return null;
}

function computeDiscount(coupon: CouponRow, subtotal: number) {
  if (coupon.discount_type === "percent") {
    return { discountAmount: round2((subtotal * Number(coupon.value)) / 100), freeShipping: false };
  }
  if (coupon.discount_type === "fixed") {
    return { discountAmount: round2(Math.min(Number(coupon.value), subtotal)), freeShipping: false };
  }
  return { discountAmount: 0, freeShipping: true };
}

export async function validateCouponCode(code: string, subtotal: number): Promise<CouponResult> {
  const trimmed = code.trim();
  if (!trimmed) return { valid: false, reason: "Enter a code." };

  const supabase = createServiceClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", trimmed)
    .eq("is_automatic", false)
    .maybeSingle();

  if (!coupon) return { valid: false, reason: "That code isn't valid." };

  const err = usageError(coupon as CouponRow, subtotal, new Date());
  if (err) return { valid: false, reason: err };

  return { valid: true, coupon: coupon as CouponRow, ...computeDiscount(coupon as CouponRow, subtotal) };
}

/** Best currently-active automatic (no-code) discount for this subtotal, if any. */
export async function getActiveAutomaticCoupon(subtotal: number): Promise<CouponResult | null> {
  const supabase = createServiceClient();
  const { data: coupons } = await supabase.from("coupons").select("*").eq("is_automatic", true).eq("is_active", true);
  const now = new Date();

  const usable = ((coupons as CouponRow[]) ?? []).filter((c) => !usageError(c, subtotal, now));
  if (usable.length === 0) return null;

  const scored = usable.map((c) => ({ coupon: c, ...computeDiscount(c, subtotal) }));
  scored.sort((a, b) => b.discountAmount - a.discountAmount);
  const best = scored[0];
  return { valid: true, coupon: best.coupon, discountAmount: best.discountAmount, freeShipping: best.freeShipping };
}

export async function incrementCouponUsage(couponId: string) {
  const supabase = createServiceClient();
  await supabase.rpc("increment_coupon_usage", { p_coupon_id: couponId });
}
