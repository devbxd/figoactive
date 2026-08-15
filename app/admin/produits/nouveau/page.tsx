import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">New product</h1>
      <ProductForm action={createProduct} categories={categories ?? []} submitLabel="Create product" />
    </div>
  );
}
