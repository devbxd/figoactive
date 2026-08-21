"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

export async function submitReview(productId: string, formData: FormData) {
  const customerName = String(formData.get("customer_name") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!customerName || rating < 1 || rating > 5) return;

  const supabase = createServiceClient();
  await supabase.from("product_reviews").insert({
    product_id: productId,
    customer_name: customerName,
    rating,
    comment,
  });

  revalidatePath("/shop", "layout");
}
