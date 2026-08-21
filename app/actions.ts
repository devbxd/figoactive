"use server";

import { createServiceClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(email: string) {
  const trimmed = email.trim();
  if (!trimmed) return { ok: false };

  const supabase = createServiceClient();
  await supabase.from("subscribers").upsert({ email: trimmed }, { onConflict: "email" });

  return { ok: true };
}
