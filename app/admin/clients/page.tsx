import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("name, phone, city, total, created_at")
    .order("created_at", { ascending: false });

  const byPhone = new Map<string, { name: string; phone: string; city: string; orderCount: number; totalSpent: number; lastOrderAt: string }>();
  for (const o of orders ?? []) {
    const existing = byPhone.get(o.phone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(o.total);
      if (o.created_at > existing.lastOrderAt) existing.lastOrderAt = o.created_at;
    } else {
      byPhone.set(o.phone, {
        name: o.name,
        phone: o.phone,
        city: o.city,
        orderCount: 1,
        totalSpent: Number(o.total),
        lastOrderAt: o.created_at,
      });
    }
  }

  const customers = Array.from(byPhone.values()).sort((a, b) => (a.lastOrderAt < b.lastOrderAt ? 1 : -1));

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">
        Customers {customers.length > 0 && <span className="text-sm font-normal text-neutral-400">({customers.length})</span>}
      </h1>
      <p className="mb-4 text-sm text-neutral-500">Built from order history — there are no customer accounts on this site.</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Phone</th>
              <th className="py-2 pr-3">City</th>
              <th className="py-2 pr-3">Orders</th>
              <th className="py-2 pr-3">Total spent</th>
              <th className="py-2 pr-3">Last order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.phone} className="border-b border-neutral-100">
                <td className="py-2.5 pr-3 font-medium">{c.name}</td>
                <td className="py-2.5 pr-3">{c.phone}</td>
                <td className="py-2.5 pr-3 text-neutral-500">{c.city}</td>
                <td className="py-2.5 pr-3">{c.orderCount}</td>
                <td className="py-2.5 pr-3 font-medium">${c.totalSpent.toFixed(2)}</td>
                <td className="py-2.5 pr-3 text-neutral-500">{new Date(c.lastOrderAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="py-6 text-sm text-neutral-500">No customers yet.</p>}
      </div>
    </div>
  );
}
