"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export async function updateOrderStatus(orderId: string, status: (typeof STATUSES)[number]) {
  if (!STATUSES.includes(status)) return;
  const supabase = createServiceClient();
  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/commandes");
}
