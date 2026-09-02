"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

function revalidateSite() {
  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

function text(formData: FormData, key: string, fallback = "") {
  return String(formData.get(key) ?? "").trim() || fallback;
}

export async function updateHomepageContent(formData: FormData) {
  const supabase = createServiceClient();

  const marqueeRaw = text(formData, "marquee_items");
  const marqueeItems = marqueeRaw
    ? marqueeRaw.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  // The philosophy image is uploaded client-side (see HomepageForm.tsx),
  // straight to Supabase Storage — this field just receives the resulting
  // URL, never the file itself, so this action's request body stays tiny.
  const philosophyImageUrl = text(formData, "philosophy_image_url") || null;

  const heroVideoUrl = text(formData, "hero_video_url", "/hero-video.mp4");

  await supabase
    .from("homepage_content")
    .update({
      hero_video_url: heroVideoUrl,
      hero_eyebrow: text(formData, "hero_eyebrow"),
      hero_title_line1: text(formData, "hero_title_line1"),
      hero_title_line2: text(formData, "hero_title_line2"),
      hero_subtext: text(formData, "hero_subtext"),
      hero_cta_label: text(formData, "hero_cta_label", "Shop Now"),
      hero_cta_href: text(formData, "hero_cta_href", "/shop"),
      instagram_handle: text(formData, "instagram_handle").replace(/^@/, ""),
      marquee_items: marqueeItems,
      category_heading: text(formData, "category_heading"),
      bestsellers_eyebrow: text(formData, "bestsellers_eyebrow"),
      bestsellers_heading: text(formData, "bestsellers_heading"),
      philosophy_eyebrow: text(formData, "philosophy_eyebrow"),
      philosophy_quote: text(formData, "philosophy_quote"),
      philosophy_image_url: philosophyImageUrl,
      philosophy_cta_label: text(formData, "philosophy_cta_label", "Shop The Collection"),
      newsletter_eyebrow: text(formData, "newsletter_eyebrow"),
      newsletter_heading: text(formData, "newsletter_heading"),
      follow_eyebrow: text(formData, "follow_eyebrow"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  revalidateSite();
}
