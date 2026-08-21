import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteProduct, importProducts } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

export default async function AdminProductsPage() {
  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, compare_at_price, stock, is_active, is_featured, category:categories(name), images:product_images(url, sort_order)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">
          Products {products && <span className="text-sm font-normal text-neutral-400">({products.length})</span>}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/admin/produits/export"
            className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wide text-neutral-600 hover:border-brand-navy hover:text-brand-navy sm:text-sm"
          >
            Export CSV
          </a>
          <form action={importProducts} encType="multipart/form-data" className="flex items-center gap-2">
            <input type="file" name="csv" accept=".csv" required className="w-40 text-xs" />
            <SubmitButton className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wide text-neutral-600 hover:border-brand-navy hover:text-brand-navy sm:text-sm">
              Import
            </SubmitButton>
          </form>
          <Link href="/admin/produits/nouveau" className="bg-brand-navy px-4 py-2 text-xs uppercase tracking-wide text-white hover:opacity-90 sm:px-5 sm:text-sm">
            New product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(products as any[] ?? []).map((p) => {
          const img = (p.images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0];
          const category = Array.isArray(p.category) ? p.category[0] : p.category;
          const hasDiscount = p.compare_at_price != null && Number(p.compare_at_price) > Number(p.price);
          const percentOff = hasDiscount ? Math.round((1 - Number(p.price) / Number(p.compare_at_price)) * 100) : 0;
          return (
            <div key={p.id} className="rounded-md border border-neutral-200 bg-white p-3">
              <div className="relative mb-2 aspect-square overflow-hidden rounded bg-brand-cream">
                {img && <Image src={img.url} alt={p.name} fill sizes="300px" className="object-cover" />}
                {!p.is_active && (
                  <span className="absolute left-2 top-2 rounded bg-neutral-900/80 px-2 py-0.5 text-xs text-white">Hidden</span>
                )}
                {hasDiscount && (
                  <span className="absolute right-2 top-2 rounded-full bg-brand-mint px-2 py-0.5 text-[10px] font-bold uppercase text-brand-navy">
                    -{percentOff}%
                  </span>
                )}
                {p.is_featured && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-neutral-500">{category?.name ?? "No category"}</p>
              {p.stock != null && (
                <p className={`text-xs ${p.stock <= 3 ? "font-semibold text-amber-600" : "text-neutral-400"}`}>
                  {p.stock} in stock
                </p>
              )}
              <p className="text-sm text-neutral-700">
                {hasDiscount ? (
                  <>
                    <span className="mr-1.5 text-neutral-400 line-through">${Number(p.compare_at_price).toFixed(2)}</span>
                    <span className="font-medium text-brand-navy">${Number(p.price).toFixed(2)}</span>
                  </>
                ) : p.price != null ? (
                  `$${Number(p.price).toFixed(2)}`
                ) : (
                  "Price to set"
                )}
              </p>
              <div className="mt-2 flex gap-3 text-sm">
                <Link href={`/admin/produits/${p.id}`} className="text-neutral-600 hover:text-brand-navy">
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteProduct(p.id);
                  }}
                >
                  <button className="text-neutral-600 hover:text-red-600">Delete</button>
                </form>
              </div>
            </div>
          );
        })}
        {(!products || products.length === 0) && <p className="text-sm text-neutral-500">No products yet.</p>}
      </div>
    </div>
  );
}
