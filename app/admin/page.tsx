import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createServiceClient();
  const [{ count: productCount }, { count: categoryCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Overview</h1>
      <div className="grid max-w-md grid-cols-2 gap-4">
        <Link href="/admin/produits" className="rounded-md border border-neutral-200 bg-white p-5 hover:border-brand-navy">
          <p className="text-2xl font-semibold text-brand-navy">{productCount ?? 0}</p>
          <p className="mt-1 text-sm text-neutral-500">Products</p>
        </Link>
        <Link href="/admin/categories" className="rounded-md border border-neutral-200 bg-white p-5 hover:border-brand-navy">
          <p className="text-2xl font-semibold text-brand-navy">{categoryCount ?? 0}</p>
          <p className="mt-1 text-sm text-neutral-500">Categories</p>
        </Link>
      </div>
    </div>
  );
}
