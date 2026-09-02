import { createClient } from "@/lib/supabase/client";
import { createSignedUploadUrl } from "./actions";

/** Uploads a file straight from the browser to Supabase Storage (see
 * createSignedUploadUrl for why) and returns its public URL. Throws with a
 * short, user-facing message on failure. */
export async function uploadFileDirect(bucket: "products" | "site-assets", folder: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { token } = await createSignedUploadUrl(bucket, path);

  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
  if (error) throw new Error(`Upload failed for ${file.name}: ${error.message}`);

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  return pub.publicUrl;
}
