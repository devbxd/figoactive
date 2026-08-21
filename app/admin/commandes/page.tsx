import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "./OrderStatusSelect";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function buildHref(params: { q?: string; status?: string }) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.status) qs.set("status", params.status);
  const s = qs.toString();
  return s ? `/admin/commandes?${s}` : "/admin/commandes";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select("id, created_at, name, phone, city, total, discount_amount, coupon_code, status, items:order_items(quantity)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);

  const { data: orders } = await query;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">
          Orders {orders && <span className="text-sm font-normal text-neutral-400">({orders.length})</span>}
        </h1>
        <a
          href="/admin/commandes/export"
          className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wide text-neutral-600 hover:border-brand-navy hover:text-brand-navy sm:text-sm"
        >
          Export CSV
        </a>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <form action="/admin/commandes" className="flex gap-2">
          <input type="hidden" name="status" value={status ?? ""} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name or phone"
            className="border border-neutral-300 px-3 py-1.5 text-sm focus:border-brand-navy focus:outline-none"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ q })}
            className={`px-3 py-1 text-xs uppercase tracking-wide ${!status ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600"}`}
          >
            All
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={buildHref({ q, status: s })}
              className={`px-3 py-1 text-xs uppercase tracking-wide ${status === s ? "bg-brand-navy text-white" : "border border-neutral-300 text-neutral-600"}`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Customer</th>
              <th className="py-2 pr-3">Items</th>
              <th className="py-2 pr-3">Total</th>
              <th className="py-2 pr-3">Coupon</th>
              <th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o: any) => (
              <tr key={o.id} className="border-b border-neutral-100">
                <td className="py-2.5 pr-3 text-neutral-500">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="py-2.5 pr-3">
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs text-neutral-500">
                    {o.phone} · {o.city}
                  </p>
                </td>
                <td className="py-2.5 pr-3">{(o.items ?? []).reduce((a: number, i: any) => a + i.quantity, 0)}</td>
                <td className="py-2.5 pr-3 font-medium">${Number(o.total).toFixed(2)}</td>
                <td className="py-2.5 pr-3 text-xs text-neutral-500">{o.coupon_code ?? "—"}</td>
                <td className="py-2.5 pr-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && <p className="py-6 text-sm text-neutral-500">No orders yet.</p>}
      </div>
    </div>
  );
}
