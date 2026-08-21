"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

function revalidateSite() {
  revalidatePath("/admin/parametres");
  revalidatePath("/", "layout");
}

// --- Announcement banner + newsletter popup ---------------------------

export async function updateSiteSettings(formData: FormData) {
  const bannerText = String(formData.get("banner_text") ?? "").trim();
  const bannerActive = formData.get("banner_active") === "on";
  const bannerEndsAtRaw = String(formData.get("banner_ends_at") ?? "").trim();
  const bannerEndsAt = bannerEndsAtRaw ? new Date(bannerEndsAtRaw).toISOString() : null;
  const newsletterPopupActive = formData.get("newsletter_popup_active") === "on";
  const newsletterCode = String(formData.get("newsletter_popup_coupon_code") ?? "").trim() || null;

  const supabase = createServiceClient();
  await supabase
    .from("site_settings")
    .update({
      banner_text: bannerText,
      banner_active: bannerActive,
      banner_ends_at: bannerEndsAt,
      newsletter_popup_active: newsletterPopupActive,
      newsletter_popup_coupon_code: newsletterCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  revalidateSite();
}

// --- Shipping zones -----------------------------------------------------

export async function createShippingZone(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const cost = Number(formData.get("cost") ?? 0);
  if (!label) return;

  const supabase = createServiceClient();
  const { count } = await supabase.from("shipping_zones").select("*", { count: "exact", head: true });
  await supabase.from("shipping_zones").insert({ label, cost, sort_order: count ?? 0 });
  revalidateSite();
}

export async function updateShippingZone(zoneId: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const cost = Number(formData.get("cost") ?? 0);
  if (!label) return;

  const supabase = createServiceClient();
  await supabase.from("shipping_zones").update({ label, cost }).eq("id", zoneId);
  revalidateSite();
}

export async function toggleShippingZoneActive(zoneId: string, isActive: boolean) {
  const supabase = createServiceClient();
  await supabase.from("shipping_zones").update({ is_active: isActive }).eq("id", zoneId);
  revalidateSite();
}

export async function deleteShippingZone(zoneId: string) {
  const supabase = createServiceClient();
  await supabase.from("shipping_zones").delete().eq("id", zoneId);
  revalidateSite();
}

// --- Payment methods ------------------------------------------------------

export async function createPaymentMethod(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  if (!label) return;

  const supabase = createServiceClient();
  const { count } = await supabase.from("payment_methods").select("*", { count: "exact", head: true });
  await supabase.from("payment_methods").insert({ label, instructions, sort_order: count ?? 0 });
  revalidateSite();
}

export async function updatePaymentMethod(methodId: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  if (!label) return;

  const supabase = createServiceClient();
  await supabase.from("payment_methods").update({ label, instructions }).eq("id", methodId);
  revalidateSite();
}

export async function togglePaymentMethodActive(methodId: string, isActive: boolean) {
  const supabase = createServiceClient();
  await supabase.from("payment_methods").update({ is_active: isActive }).eq("id", methodId);
  revalidateSite();
}

export async function deletePaymentMethod(methodId: string) {
  const supabase = createServiceClient();
  await supabase.from("payment_methods").delete().eq("id", methodId);
  revalidateSite();
}

// --- FAQ items ------------------------------------------------------------

export async function createFaqItem(formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) return;

  const supabase = createServiceClient();
  const { count } = await supabase.from("faq_items").select("*", { count: "exact", head: true });
  await supabase.from("faq_items").insert({ question, answer, sort_order: count ?? 0 });
  revalidateSite();
}

export async function updateFaqItem(itemId: string, formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) return;

  const supabase = createServiceClient();
  await supabase.from("faq_items").update({ question, answer }).eq("id", itemId);
  revalidateSite();
}

export async function deleteFaqItem(itemId: string) {
  const supabase = createServiceClient();
  await supabase.from("faq_items").delete().eq("id", itemId);
  revalidateSite();
}
