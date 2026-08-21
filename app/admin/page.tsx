import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { LOW_STOCK_THRESHOLD } from "@/lib/site";

export default async function AdminOverviewPage() {
  const supabase = createServiceClient();
  const [
    { count: productCount },
    { count: categoryCount },
    { count: orderCount },
    { count: pendingReviewCount },
    { data: orders },
    { data: lowStockProducts },
    { data: lowStockVariants },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("product_reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("orders").select("total, created_at").order("created_at", { ascending: false }).limit(500),
    supabase.from("products").select("id, name, stock").not("stock", "is", null).lte("stock", LOW_STOCK_THRESHOLD),
    supabase
      .from("product_variants")
      .select("id, color_label, size_label, stock, product:products(name)")
      .not("stock", "is", null)
      .lte("stock", LOW_STOCK_THRESHOLD),
  ]);

  const revenue = (orders ?? []).reduce((a, o) => a + Number(o.total), 0);
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const revenue30d = (orders ?? [])
    .filter((o) => new Date(o.created_at).getTime() >= thirtyDaysAgo)
    .reduce((a, o) => a + Number(o.total), 0);

  const lowStock = [
    ...(lowStockProducts ?? []).map((p) => ({ id: p.id, label: p.name, stock: p.stock })),
    ...(lowStockVariants ?? []).map((v: any) => {
      const product = Array.isArray(v.product) ? v.product[0] : v.product;
      const variantLabel = [v.color_label, v.size_label].filter(Boolean).join(" / ");
      return { id: v.id, label: `${product?.name ?? "?"}${variantLabel ? ` (${variantLabel})` : ""}`, stock: v.stock };
    }),
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Overview</h1>

      <div className="grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
        <Link href="/admin/produits" className="rounded-md border border-neutral-200 bg-white p-5 hover:border-brand-navy">
          <p className="text-2xl font-semibold text-brand-navy">{productCount ?? 0}</p>
          <p className="mt-1 text-sm text-neutral-500">Products</p>
        </Link>
        <Link href="/admin/categories" className="rounded-md border border-neutral-200 bg-white p-5 hover:border-brand-navy">
          <p className="text-2xl font-semibold text-brand-navy">{categoryCount ?? 0}</p>
          <p className="mt-1 text-sm text-neutral-500">Categories</p>
        </Link>
        <Link href="/admin/commandes" className="rounded-md border border-neutral-200 bg-white p-5 hover:border-brand-navy">
          <p className="text-2xl font-semibold text-brand-navy">{orderCount ?? 0}</p>
          <p className="mt-1 text-sm text-neutral-500">Orders</p>
        </Link>
        <div className="rounded-md border border-neutral-200 bg-white p-5">
          <p className="text-2xl font-semibold text-brand-navy">${revenue.toFixed(2)}</p>
          <p className="mt-1 text-sm text-neutral-500">Total revenue</p>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-5">
          <p className="text-2xl font-semibold text-brand-navy">${revenue30d.toFixed(2)}</p>
          <p className="mt-1 text-sm text-neutral-500">Last 30 days</p>
        </div>
        <Link href="/admin/avis" className="rounded-md border border-neutral-200 bg-white p-5 hover:border-brand-navy">
          <p className="text-2xl font-semibold text-brand-navy">{pendingReviewCount ?? 0}</p>
          <p className="mt-1 text-sm text-neutral-500">Reviews to approve</p>
        </Link>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-8 max-w-md">
          <h2 className="mb-2 font-heading text-sm uppercase tracking-wide text-amber-700">Low stock</h2>
          <div className="border border-amber-200 bg-amber-50 p-3">
            {lowStock.map((item) => (
              <p key={item.id} className="py-1 text-sm text-amber-800">
                {item.label} — {item.stock} left
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
