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

export type HomepageContent = {
  heroVideoUrl: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtext: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  instagramHandle: string;
  marqueeItems: string[];
  categoryHeading: string;
  bestsellersEyebrow: string;
  bestsellersHeading: string;
  philosophyEyebrow: string;
  philosophyQuote: string;
  philosophyImageUrl: string | null;
  philosophyCtaLabel: string;
  newsletterEyebrow: string;
  newsletterHeading: string;
  followEyebrow: string;
};

const HOMEPAGE_DEFAULTS: HomepageContent = {
  heroVideoUrl: "/hero-video.mp4",
  heroEyebrow: "New Season · Built To Move",
  heroTitleLine1: "Own Every",
  heroTitleLine2: "Street",
  heroSubtext:
    "We believe sweat should never dull your shine. Performance activewear for fearless athletes who own every stride and every street.",
  heroCtaLabel: "Shop Now",
  heroCtaHref: "/shop",
  instagramHandle: "figoactive",
  marqueeItems: ["Elevate Every Rep", "Cash On Delivery", "Free Shipping In Beirut", "New Drops Weekly"],
  categoryHeading: "Shop by category",
  bestsellersEyebrow: "Fan favorites",
  bestsellersHeading: "Bestsellers",
  philosophyEyebrow: "The philosophy",
  philosophyQuote: "Inspired by the fear of being average",
  philosophyImageUrl: null,
  philosophyCtaLabel: "Shop The Collection",
  newsletterEyebrow: "Stay in the loop",
  newsletterHeading: "New drops, restocks and exclusive discounts",
  followEyebrow: "Follow along",
};

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("homepage_content").select("*").eq("id", "default").single();
  if (!data) return HOMEPAGE_DEFAULTS;

  return {
    heroVideoUrl: data.hero_video_url ?? HOMEPAGE_DEFAULTS.heroVideoUrl,
    heroEyebrow: data.hero_eyebrow ?? HOMEPAGE_DEFAULTS.heroEyebrow,
    heroTitleLine1: data.hero_title_line1 ?? HOMEPAGE_DEFAULTS.heroTitleLine1,
    heroTitleLine2: data.hero_title_line2 ?? HOMEPAGE_DEFAULTS.heroTitleLine2,
    heroSubtext: data.hero_subtext ?? HOMEPAGE_DEFAULTS.heroSubtext,
    heroCtaLabel: data.hero_cta_label ?? HOMEPAGE_DEFAULTS.heroCtaLabel,
    heroCtaHref: data.hero_cta_href ?? HOMEPAGE_DEFAULTS.heroCtaHref,
    instagramHandle: data.instagram_handle ?? HOMEPAGE_DEFAULTS.instagramHandle,
    marqueeItems: data.marquee_items?.length ? data.marquee_items : HOMEPAGE_DEFAULTS.marqueeItems,
    categoryHeading: data.category_heading ?? HOMEPAGE_DEFAULTS.categoryHeading,
    bestsellersEyebrow: data.bestsellers_eyebrow ?? HOMEPAGE_DEFAULTS.bestsellersEyebrow,
    bestsellersHeading: data.bestsellers_heading ?? HOMEPAGE_DEFAULTS.bestsellersHeading,
    philosophyEyebrow: data.philosophy_eyebrow ?? HOMEPAGE_DEFAULTS.philosophyEyebrow,
    philosophyQuote: data.philosophy_quote ?? HOMEPAGE_DEFAULTS.philosophyQuote,
    philosophyImageUrl: data.philosophy_image_url ?? null,
    philosophyCtaLabel: data.philosophy_cta_label ?? HOMEPAGE_DEFAULTS.philosophyCtaLabel,
    newsletterEyebrow: data.newsletter_eyebrow ?? HOMEPAGE_DEFAULTS.newsletterEyebrow,
    newsletterHeading: data.newsletter_heading ?? HOMEPAGE_DEFAULTS.newsletterHeading,
    followEyebrow: data.follow_eyebrow ?? HOMEPAGE_DEFAULTS.followEyebrow,
  };
}
