"use client";

import { useState } from "react";
import { updateHomepageContent } from "./actions";
import { uploadFileDirect } from "@/lib/storage/uploadClient";

type HomepageRow = {
  hero_video_url: string | null;
  hero_eyebrow: string | null;
  hero_title_line1: string | null;
  hero_title_line2: string | null;
  hero_subtext: string | null;
  hero_cta_label: string | null;
  hero_cta_href: string | null;
  instagram_handle: string | null;
  marquee_items: string[] | null;
  category_heading: string | null;
  bestsellers_eyebrow: string | null;
  bestsellers_heading: string | null;
  philosophy_eyebrow: string | null;
  philosophy_quote: string | null;
  philosophy_image_url: string | null;
  philosophy_cta_label: string | null;
  newsletter_eyebrow: string | null;
  newsletter_heading: string | null;
  follow_eyebrow: string | null;
} | null;

export function HomepageForm({ content: c }: { content: HomepageRow }) {
  const marqueeText = (c?.marquee_items ?? []).join(", ");

  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(c?.philosophy_image_url ?? "");

  // The philosophy image uploads straight from the browser to Supabase
  // Storage before the rest of the form is submitted as a Server Action —
  // routing the raw file through the action instead hits request-size
  // limits on Netlify (and similar hosts) well below a real phone photo.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    const file = formData.get("philosophy_image_file") as File | null;
    formData.delete("philosophy_image_file");

    setSaving(true);
    try {
      if (file && file.size > 0) {
        const url = await uploadFileDirect("site-assets", "homepage", file);
        formData.set("philosophy_image_url", url);
      }
      await updateHomepageContent(formData);
      setSaved(true);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Something went wrong saving the homepage.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">Hero section</h2>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Background video URL</label>
          <input
            name="hero_video_url"
            defaultValue={c?.hero_video_url ?? ""}
            placeholder="/hero-video.mp4 or https://..."
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Paste a link to an MP4 file (e.g. hosted on Supabase, YouTube-hosted MP4 export, or any direct video URL)
            to replace the hero background video.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Eyebrow text</label>
          <input
            name="hero_eyebrow"
            defaultValue={c?.hero_eyebrow ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Title line 1</label>
            <input
              name="hero_title_line1"
              defaultValue={c?.hero_title_line1 ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Title line 2</label>
            <input
              name="hero_title_line2"
              defaultValue={c?.hero_title_line2 ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Subtext</label>
          <textarea
            name="hero_subtext"
            rows={2}
            defaultValue={c?.hero_subtext ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Button text</label>
            <input
              name="hero_cta_label"
              defaultValue={c?.hero_cta_label ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Button link</label>
            <input
              name="hero_cta_href"
              defaultValue={c?.hero_cta_href ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Instagram handle (no @)</label>
          <input
            name="instagram_handle"
            defaultValue={c?.instagram_handle ?? ""}
            className="w-full max-w-xs border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
          <p className="mt-1 text-xs text-neutral-400">Used for the hero button and the "Follow along" section.</p>
        </div>
      </section>

      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">Scrolling marquee strip</h2>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Items (comma-separated)</label>
          <textarea
            name="marquee_items"
            rows={2}
            defaultValue={marqueeText}
            placeholder="Elevate Every Rep, Cash On Delivery, Free Shipping In Beirut, New Drops Weekly"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      </section>

      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">Category section</h2>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Heading</label>
          <input
            name="category_heading"
            defaultValue={c?.category_heading ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      </section>

      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">Bestsellers section</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Eyebrow text</label>
            <input
              name="bestsellers_eyebrow"
              defaultValue={c?.bestsellers_eyebrow ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Heading</label>
            <input
              name="bestsellers_heading"
              defaultValue={c?.bestsellers_heading ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">"Philosophy" banner section</h2>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Background image</label>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="mb-2 h-32 w-full max-w-sm bg-neutral-100 object-cover" />
          )}
          <input
            name="philosophy_image_url"
            defaultValue={c?.philosophy_image_url ?? ""}
            onChange={(e) => setPreviewUrl(e.target.value)}
            placeholder="https://... (leave as-is to keep current)"
            className="mb-2 w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
          <input
            name="philosophy_image_file"
            type="file"
            accept="image/*"
            disabled={saving}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreviewUrl(URL.createObjectURL(file));
            }}
            className="w-full text-sm"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Either paste an image URL above or upload a file here — uploading a file takes priority. Falls back to a
            product photo if left empty.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Eyebrow text</label>
          <input
            name="philosophy_eyebrow"
            defaultValue={c?.philosophy_eyebrow ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Quote</label>
          <textarea
            name="philosophy_quote"
            rows={2}
            defaultValue={c?.philosophy_quote ?? ""}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-600">Button text</label>
          <input
            name="philosophy_cta_label"
            defaultValue={c?.philosophy_cta_label ?? ""}
            className="w-full max-w-xs border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      </section>

      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">Newsletter section</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Eyebrow text</label>
            <input
              name="newsletter_eyebrow"
              defaultValue={c?.newsletter_eyebrow ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Heading</label>
            <input
              name="newsletter_heading"
              defaultValue={c?.newsletter_heading ?? ""}
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-sm uppercase tracking-wide text-neutral-500">Follow along section</h2>
        <div>
          <label className="mb-1 block text-sm text-neutral-600">Eyebrow text</label>
          <input
            name="follow_eyebrow"
            defaultValue={c?.follow_eyebrow ?? ""}
            className="w-full max-w-xs border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
        </div>
      </section>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-navy px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
      </div>
    </form>
  );
}
