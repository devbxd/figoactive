// Site-wide content that used to be hardcoded in lib/site.ts / component
// files — now editable from /admin/parametres. Read on the server and
// passed down as props; nothing here is fetched from the browser.
import { createServiceClient } from "@/lib/supabase/server";

export type SiteSettings = {
  bannerText: string;
  bannerActive: boolean;
  bannerEndsAt: string | null;
  newsletterPopupActive: boolean;
  newsletterPopupCouponCode: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", "default").single();

  return {
    bannerText: data?.banner_text ?? "",
    bannerActive: data?.banner_active ?? false,
    bannerEndsAt: data?.banner_ends_at ?? null,
    newsletterPopupActive: data?.newsletter_popup_active ?? false,
    newsletterPopupCouponCode: data?.newsletter_popup_coupon_code ?? null,
  };
}

export type ShippingZone = { id: string; label: string; cost: number };

export async function getShippingZones(): Promise<ShippingZone[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("shipping_zones")
    .select("id, label, cost")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map((z) => ({ id: z.id, label: z.label, cost: Number(z.cost) }));
}

export type PaymentMethod = { id: string; label: string; instructions: string };

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("payment_methods")
    .select("id, label, instructions")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export type FaqItem = { id: string; question: string; answer: string };

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("faq_items").select("id, question, answer").order("sort_order", { ascending: true });
  return data ?? [];
}
