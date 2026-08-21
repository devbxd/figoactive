import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "../ProductForm";
import { ProductImageGrid } from "../ProductImageGrid";
import { updateProduct, duplicateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: product }, { data: categories }, { data: otherProducts }, { data: relations }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "*, images:product_images(id, url, sort_order), variants:product_variants(color_label, size_label, price, compare_at_price, stock, available, sort_order)"
      )
      .eq("id", id)
      .single(),
    supabase.from("categories").select("id, name").order("sort_order"),
    supabase.from("products").select("id, name").neq("id", id).order("name"),
    supabase.from("product_relations").select("related_product_id").eq("product_id", id),
  ]);

  if (!product) notFound();

  const images = (product.images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const variants = (product.variants ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const updateWithId = updateProduct.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Edit product</h1>
        <form action={duplicateProduct.bind(null, id)}>
          <button className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wide text-neutral-600 hover:border-brand-navy hover:text-brand-navy">
            Duplicate
          </button>
        </form>
      </div>

      <ProductImageGrid images={images} />

      <ProductForm
        action={updateWithId}
        categories={categories ?? []}
        product={{ ...product, variants }}
        submitLabel="Save"
        otherProducts={otherProducts ?? []}
        relatedProductIds={(relations ?? []).map((r) => r.related_product_id)}
      />
    </div>
  );
}
