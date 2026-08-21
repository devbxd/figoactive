"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

export async function approveReview(reviewId: string) {
  const supabase = createServiceClient();
  await supabase.from("product_reviews").update({ is_approved: true }).eq("id", reviewId);
  revalidatePath("/admin/avis");
  revalidatePath("/shop", "layout");
}

export async function deleteReview(reviewId: string) {
  const supabase = createServiceClient();
  await supabase.from("product_reviews").delete().eq("id", reviewId);
  revalidatePath("/admin/avis");
  revalidatePath("/shop", "layout");
}
