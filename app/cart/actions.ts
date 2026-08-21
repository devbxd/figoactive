"use server";

import { validateCouponCode } from "@/lib/coupons";

export async function previewCoupon(code: string, subtotal: number) {
  const result = await validateCouponCode(code, subtotal);
  if (!result.valid) return { valid: false as const, reason: result.reason };
  return { valid: true as const, discountAmount: result.discountAmount, freeShipping: result.freeShipping };
}
