import { createServiceClient } from "@/lib/supabase/server";
import { createCoupon } from "./actions";
import { CouponForm } from "./CouponForm";
import { CouponRow } from "./CouponRow";

export default async function AdminCouponsPage() {
  const supabase = createServiceClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Coupons</h1>

      <div className="mb-8">
        <h2 className="mb-2 font-heading text-sm uppercase tracking-wide text-neutral-500">New coupon</h2>
        <CouponForm action={createCoupon} submitLabel="Create coupon" />
      </div>

      <div className="max-w-2xl border-t border-neutral-100">
        {(coupons ?? []).map((c) => (
          <CouponRow key={c.id} coupon={c as any} />
        ))}
        {(!coupons || coupons.length === 0) && <p className="py-6 text-sm text-neutral-500">No coupons yet.</p>}
      </div>
    </div>
  );
}
