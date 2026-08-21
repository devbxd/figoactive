"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

function fieldsFromForm(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase() || null;
  const discountType = String(formData.get("discount_type") ?? "percent");
  const valueRaw = String(formData.get("value") ?? "").trim();
  const value = valueRaw ? Number(valueRaw) : 0;
  const minSubtotalRaw = String(formData.get("min_subtotal") ?? "").trim();
  const minSubtotal = minSubtotalRaw ? Number(minSubtotalRaw) : null;
  const usageLimitRaw = String(formData.get("usage_limit") ?? "").trim();
  const usageLimit = usageLimitRaw ? Number(usageLimitRaw) : null;
  const startsAtRaw = String(formData.get("starts_at") ?? "").trim();
  const startsAt = startsAtRaw ? new Date(startsAtRaw).toISOString() : null;
  const endsAtRaw = String(formData.get("ends_at") ?? "").trim();
  const endsAt = endsAtRaw ? new Date(endsAtRaw).toISOString() : null;
  const isAutomatic = formData.get("is_automatic") === "on";

  return {
    code: isAutomatic ? null : code,
    discount_type: discountType,
    value,
    min_subtotal: minSubtotal,
    usage_limit: usageLimit,
    starts_at: startsAt,
    ends_at: endsAt,
    is_automatic: isAutomatic,
  };
}

export async function createCoupon(formData: FormData) {
  const f = fieldsFromForm(formData);
  if (!f.is_automatic && !f.code) return;

  const supabase = createServiceClient();
  await supabase.from("coupons").insert(f);
  revalidatePath("/admin/coupons");
}

export async function updateCoupon(couponId: string, formData: FormData) {
  const f = fieldsFromForm(formData);
  if (!f.is_automatic && !f.code) return;

  const supabase = createServiceClient();
  await supabase.from("coupons").update(f).eq("id", couponId);
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(couponId: string, isActive: boolean) {
  const supabase = createServiceClient();
  await supabase.from("coupons").update({ is_active: isActive }).eq("id", couponId);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(couponId: string) {
  const supabase = createServiceClient();
  await supabase.from("coupons").delete().eq("id", couponId);
  revalidatePath("/admin/coupons");
}
