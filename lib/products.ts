// Product catalog — backed by Supabase (categories, products,
// product_images, product_variants). Edit products from /admin instead of
// this file. Row shapes stay snake_case in the DB; everything here maps
// back to the same camelCase Product/ProductVariant shape the rest of the
// app (ProductCard, ProductDetail, catalog.csv, ...) already expects.
import { createServiceClient } from "@/lib/supabase/server";

export type ProductVariant = {
  id: string;
  color: string | null;
  size: string | null;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  variants: ProductVariant[];
  inStock: boolean;
  isFeatured: boolean;
  tags: string[];
};

const PRODUCT_SELECT =
  "id, slug, name, description, price, compare_at_price, stock, is_featured, tags, category:categories(name), images:product_images(url, sort_order), variants:product_variants(id, color_label, size_label, price, compare_at_price, available, stock, sort_order)";

function normalize(row: any): Product {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const images = (row.images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((i: any) => i.url);
  const variants = (row.variants ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((v: any) => ({
      id: v.id,
      color: v.color_label,
      size: v.size_label,
      price: v.price != null ? Number(v.price) : Number(row.price),
      compareAtPrice: v.compare_at_price != null ? Number(v.compare_at_price) : null,
      // A tracked stock of 0 overrides the manual "available" toggle —
      // whichever says out-of-stock wins.
      available: v.available && (v.stock == null || v.stock > 0),
    }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: category?.name ?? "",
    description: row.description ?? "",
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    images,
    variants,
    inStock: row.stock == null || row.stock > 0,
    isFeatured: row.is_featured ?? false,
    tags: row.tags ?? [],
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return ((data as any[]) ?? []).map(normalize);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.isFeatured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  return Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).eq("is_active", true).single();
  return data ? normalize(data) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createServiceClient();
  const { data: relations } = await supabase
    .from("product_relations")
    .select("related_product_id, sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const products = await getProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  const manual = (relations ?? [])
    .map((r) => byId.get(r.related_product_id))
    .filter((p): p is Product => !!p && p.slug !== product.slug);

  if (manual.length > 0) return manual.slice(0, limit);

  return products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, limit);
}
