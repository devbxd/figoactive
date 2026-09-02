"use server";

import { createServiceClient } from "@/lib/supabase/server";

/**
 * Mints a short-lived signed upload URL so the browser can PUT the file
 * straight to Supabase Storage instead of routing the binary through a
 * Server Action. Netlify (and most serverless hosts) cap function request
 * bodies well below real-world photo sizes — a phone photo failed there
 * even after raising Next's own bodySizeLimit, because that config only
 * governs Next's parsing, not the underlying function's payload ceiling.
 * This keeps every request that actually reaches our server tiny (a path
 * string in, a token out); only the browser <-> Supabase Storage leg ever
 * carries the image bytes.
 */
export async function createSignedUploadUrl(bucket: "products" | "site-assets", path: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || "Could not prepare the upload");
  return { bucket, path: data.path, token: data.token };
}
