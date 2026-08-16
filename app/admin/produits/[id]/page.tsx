import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "../ProductForm";
import { ProductImageGrid } from "../ProductImageGrid";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(id, url, sort_order), variants:product_variants(color_label, size_label, price, available, sort_order)")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  if (!product) notFound();

  const images = (product.images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const variants = (product.variants ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const updateWithId = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Edit product</h1>

      <ProductImageGrid images={images} />

      <ProductForm action={updateWithId} categories={categories ?? []} product={{ ...product, variants }} submitLabel="Save" />
    </div>
  );
}
