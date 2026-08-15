import { createClient } from "@/lib/supabase/server";

export type ProductVariant = {
  color_label: string | null;
  size_label: string | null;
  price: number | null;
  compare_at_price: number | null;
  available: boolean;
};

export type ProductImage = { url: string };

export type Category = { id: string; name: string; slug: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  compare_at_price: number | null;
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

const PRODUCT_SELECT =
  "id, slug, name, description, price, compare_at_price, category:categories(id, name, slug), images:product_images(url, sort_order), variants:product_variants(color_label, size_label, price, compare_at_price, available, sort_order)";

function normalize(row: any): Product {
  return {
    ...row,
    category: Array.isArray(row.category) ? row.category[0] ?? null : row.category,
    images: (row.images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    variants: (row.variants ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, slug").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = await createClient();
  const categoryRelation = categorySlug ? "categories!inner" : "categories";
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT.replace("categories(", `${categoryRelation}(`))
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (categorySlug) query = query.eq("categories.slug", categorySlug);

  const { data } = await query;
  return ((data as any[]) ?? []).map(normalize);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).eq("is_active", true).single();
  return data ? normalize(data as any) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!product.category) return [];
  const products = await getProducts(product.category.slug);
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}
