"use server";

import { createServiceClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(email: string) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) return { ok: false };

  const supabase = createServiceClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email: trimmed });
  // 23505 = already subscribed (unique constraint) — treat as success either way.
  if (error && error.code !== "23505") return { ok: false };

  return { ok: true };
}
