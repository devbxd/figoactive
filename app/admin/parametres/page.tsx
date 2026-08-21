import { createServiceClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/SubmitButton";
import {
  updateSiteSettings,
  createShippingZone,
  createPaymentMethod,
  createFaqItem,
} from "./actions";
import { ShippingZoneRow } from "./ShippingZoneRow";
import { PaymentMethodRow } from "./PaymentMethodRow";
import { FaqItemRow } from "./FaqItemRow";

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function AdminSettingsPage() {
  const supabase = createServiceClient();
  const [{ data: settings }, { data: zones }, { data: methods }, { data: faqs }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", "default").single(),
    supabase.from("shipping_zones").select("*").order("sort_order"),
    supabase.from("payment_methods").select("*").order("sort_order"),
    supabase.from("faq_items").select("*").order("sort_order"),
  ]);

  return (
    <div className="max-w-2xl space-y-12">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Settings</h1>

      <section>
        <h2 className="mb-3 font-heading text-sm uppercase tracking-wide text-neutral-500">
          Announcement banner &amp; newsletter popup
        </h2>
        <form action={updateSiteSettings} className="space-y-3 border border-neutral-200 bg-white p-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Banner text</label>
            <input
              name="banner_text"
              defaultValue={settings?.banner_text ?? ""}
              placeholder="End of season sale — up to 30% off"
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" name="banner_active" defaultChecked={settings?.banner_active ?? false} />
            Show banner on the site
          </label>
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Countdown ends at (optional)</label>
            <input
              name="banner_ends_at"
              type="datetime-local"
              defaultValue={toLocalInput(settings?.banner_ends_at ?? null)}
              className="w-full max-w-xs border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
            />
          </div>

          <div className="border-t border-neutral-100 pt-3">
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                name="newsletter_popup_active"
                defaultChecked={settings?.newsletter_popup_active ?? false}
              />
              Show newsletter signup popup on the site
            </label>
            <div className="mt-2">
              <label className="mb-1 block text-sm text-neutral-600">Coupon code to offer signups (optional)</label>
              <input
                name="newsletter_popup_coupon_code"
                defaultValue={settings?.newsletter_popup_coupon_code ?? ""}
                placeholder="WELCOME10"
                className="w-full max-w-xs border border-neutral-300 px-3 py-2 text-sm uppercase focus:border-brand-navy focus:outline-none"
              />
            </div>
          </div>

          <SubmitButton className="bg-brand-navy px-6 py-2.5 text-sm uppercase tracking-wide text-white hover:opacity-90">
            Save
          </SubmitButton>
        </form>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-sm uppercase tracking-wide text-neutral-500">Shipping zones</h2>
        <form action={createShippingZone} className="mb-3 flex flex-wrap gap-2">
          <input name="label" required placeholder="Zone (e.g. Beirut)" className="border border-neutral-300 px-3 py-2 text-sm" />
          <input name="cost" type="number" step="0.01" required placeholder="Cost" className="w-28 border border-neutral-300 px-3 py-2 text-sm" />
          <SubmitButton className="bg-brand-navy px-4 py-2 text-xs uppercase tracking-wide text-white hover:opacity-90">
            Add
          </SubmitButton>
        </form>
        <div className="border-t border-neutral-100">
          {(zones ?? []).map((z) => (
            <ShippingZoneRow key={z.id} zone={z} />
          ))}
          {(!zones || zones.length === 0) && <p className="py-3 text-sm text-neutral-500">No shipping zones yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-sm uppercase tracking-wide text-neutral-500">Payment methods</h2>
        <form action={createPaymentMethod} className="mb-3 flex flex-wrap gap-2">
          <input name="label" required placeholder="Method (e.g. Bank transfer)" className="border border-neutral-300 px-3 py-2 text-sm" />
          <input name="instructions" placeholder="Instructions shown at checkout" className="min-w-[16rem] flex-1 border border-neutral-300 px-3 py-2 text-sm" />
          <SubmitButton className="bg-brand-navy px-4 py-2 text-xs uppercase tracking-wide text-white hover:opacity-90">
            Add
          </SubmitButton>
        </form>
        <div className="border-t border-neutral-100">
          {(methods ?? []).map((m) => (
            <PaymentMethodRow key={m.id} method={m} />
          ))}
          {(!methods || methods.length === 0) && <p className="py-3 text-sm text-neutral-500">No payment methods yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-sm uppercase tracking-wide text-neutral-500">FAQ</h2>
        <form action={createFaqItem} className="mb-3 space-y-2 border border-neutral-200 bg-white p-4">
          <input name="question" required placeholder="Question" className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          <textarea name="answer" required rows={2} placeholder="Answer" className="w-full border border-neutral-300 px-3 py-2 text-sm" />
          <SubmitButton className="bg-brand-navy px-4 py-2 text-xs uppercase tracking-wide text-white hover:opacity-90">
            Add
          </SubmitButton>
        </form>
        <div className="border-t border-neutral-100">
          {(faqs ?? []).map((f) => (
            <FaqItemRow key={f.id} item={f} />
          ))}
          {(!faqs || faqs.length === 0) && <p className="py-3 text-sm text-neutral-500">No FAQ items yet.</p>}
        </div>
      </section>
    </div>
  );
}
