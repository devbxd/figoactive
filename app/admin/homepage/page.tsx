import { createServiceClient } from "@/lib/supabase/server";
import { HomepageForm } from "./HomepageForm";

export default async function AdminHomepagePage() {
  const supabase = createServiceClient();
  const { data: content } = await supabase.from("homepage_content").select("*").eq("id", "default").single();

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Homepage</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Edit everything shown on the public homepage — video, headings, text and images. Changes go live as soon
          as you save.
        </p>
      </div>

      <HomepageForm content={content} />
    </div>
  );
}
