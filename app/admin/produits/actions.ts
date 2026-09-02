"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

function imageUrlsFromForm(formData: FormData) {
  return (formData.getAll("image_url") as string[]).map((u) => u.trim()).filter(Boolean);
}

function parseVariantRows(formData: FormData) {
  const colors = formData.getAll("variant_color") as string[];
  const sizes = formData.getAll("variant_size") as string[];
  const prices = formData.getAll("variant_price") as string[];
  const compareAtPrices = formData.getAll("variant_compare_at_price") as string[];
  const stocks = formData.getAll("variant_stock") as string[];
  const availableFlags = formData.getAll("variant_available") as string[];
  const rowKeys = formData.getAll("variant_key") as string[];

  return rowKeys
    .map((key, i) => ({
      colorLabel: colors[i]?.trim() || null,
      sizeLabel: sizes[i]?.trim() || null,
      price: prices[i]?.trim() ? Number(prices[i]) : null,
      compareAtPrice: compareAtPrices[i]?.trim() ? Number(compareAtPrices[i]) : null,
      stock: stocks[i]?.trim() ? Number(stocks[i]) : null,
      available: availableFlags.includes(key),
    }))
    .filter((v) => v.colorLabel || v.sizeLabel);
}

async function saveVariants(supabase: ReturnType<typeof createServiceClient>, productId: string, formData: FormData) {
  await supabase.from("product_variants").delete().eq("product_id", productId);
  const rows = parseVariantRows(formData);
  if (rows.length === 0) return;
  await supabase.from("product_variants").insert(
    rows.map((v, i) => ({
      product_id: productId,
      color_label: v.colorLabel,
      size_label: v.sizeLabel,
      price: v.price,
      compare_at_price: v.compareAtPrice,
      stock: v.stock,
      available: v.available,
      sort_order: i,
    }))
  );
}

function parseTags(formData: FormData) {
  const raw = String(formData.get("tags") ?? "").trim();
  if (!raw) return [];
  return Array.from(new Set(raw.split(",").map((t) => t.trim()).filter(Boolean)));
}

async function saveRelatedProducts(supabase: ReturnType<typeof createServiceClient>, productId: string, formData: FormData) {
  await supabase.from("product_relations").delete().eq("product_id", productId);
  const relatedIds = (formData.getAll("related_product_id") as string[]).filter((id) => id && id !== productId);
  if (relatedIds.length === 0) return;
  await supabase.from("product_relations").insert(
    relatedIds.map((relatedId, i) => ({ product_id: productId, related_product_id: relatedId, sort_order: i }))
  );
}

function productFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw ? Number(priceRaw) : null;
  const compareRaw = String(formData.get("compare_at_price") ?? "").trim();
  const compareAtPrice = compareRaw ? Number(compareRaw) : null;
  const stockRaw = String(formData.get("stock") ?? "").trim();
  const stock = stockRaw ? Number(stockRaw) : null;
  const isFeatured = formData.get("is_featured") === "on";
  const tags = parseTags(formData);
  return { name, categoryId, description, price, compareAtPrice, stock, isFeatured, tags };
}

export async function createProduct(formData: FormData) {
  const f = productFields(formData);
  const imageUrls = imageUrlsFromForm(formData);

  if (!f.name) return;

  const supabase = createServiceClient();
  const slug = `${slugify(f.name)}-${Math.random().toString(36).slice(2, 7)}`;

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: f.name,
      slug,
      category_id: f.categoryId,
      description: f.description,
      price: f.price,
      compare_at_price: f.compareAtPrice,
      stock: f.stock,
      is_featured: f.isFeatured,
      tags: f.tags,
    })
    .select("id, slug")
    .single();

  if (error || !product) throw error;

  await saveVariants(supabase, product.id, formData);

  if (imageUrls.length > 0) {
    await supabase.from("product_images").insert(imageUrls.map((url, i) => ({ product_id: product.id, url, sort_order: i })));
  }

  revalidatePath("/admin/produits");
  revalidatePath("/", "layout");
  redirect(`/admin/produits/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const f = productFields(formData);
  const isActive = formData.get("is_active") === "on";
  const imageUrls = imageUrlsFromForm(formData);

  if (!f.name) return;

  const supabase = createServiceClient();

  await supabase
    .from("products")
    .update({
      name: f.name,
      category_id: f.categoryId,
      description: f.description,
      price: f.price,
      compare_at_price: f.compareAtPrice,
      stock: f.stock,
      is_featured: f.isFeatured,
      tags: f.tags,
      is_active: isActive,
    })
    .eq("id", productId);

  await saveVariants(supabase, productId, formData);
  await saveRelatedProducts(supabase, productId, formData);

  if (imageUrls.length > 0) {
    const { count } = await supabase.from("product_images").select("*", { count: "exact", head: true }).eq("product_id", productId);
    await supabase
      .from("product_images")
      .insert(imageUrls.map((url, i) => ({ product_id: productId, url, sort_order: (count ?? 0) + i })));
  }

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteProduct(productId: string) {
  const supabase = createServiceClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin/produits");
  revalidatePath("/", "layout");
}

export async function deleteProductImage(imageId: string) {
  const supabase = createServiceClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath("/admin/produits");
  revalidatePath("/", "layout");
}

export async function duplicateProduct(productId: string) {
  const supabase = createServiceClient();
  const { data: original } = await supabase
    .from("products")
    .select("*, images:product_images(url, sort_order), variants:product_variants(color_label, size_label, price, compare_at_price, stock, available, sort_order)")
    .eq("id", productId)
    .single();
  if (!original) return;

  const slug = `${slugify(original.name)}-copy-${Math.random().toString(36).slice(2, 7)}`;
  const { data: copy, error } = await supabase
    .from("products")
    .insert({
      category_id: original.category_id,
      name: `${original.name} (copy)`,
      slug,
      description: original.description,
      price: original.price,
      compare_at_price: original.compare_at_price,
      stock: original.stock,
      is_featured: false,
      tags: original.tags,
      is_active: false,
    })
    .select("id")
    .single();
  if (error || !copy) throw error;

  const images = (original.images ?? []) as { url: string; sort_order: number }[];
  if (images.length > 0) {
    await supabase.from("product_images").insert(images.map((img) => ({ product_id: copy.id, url: img.url, sort_order: img.sort_order })));
  }

  const variants = (original.variants ?? []) as any[];
  if (variants.length > 0) {
    await supabase.from("product_variants").insert(
      variants.map((v) => ({
        product_id: copy.id,
        color_label: v.color_label,
        size_label: v.size_label,
        price: v.price,
        compare_at_price: v.compare_at_price,
        stock: v.stock,
        available: v.available,
        sort_order: v.sort_order,
      }))
    );
  }

  revalidatePath("/admin/produits");
  redirect(`/admin/produits/${copy.id}`);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  return rows;
}

/** Upserts products by slug from a CSV (same columns as the export). Only
 * touches the core fields — images and variants aren't part of the sheet. */
export async function importProducts(formData: FormData) {
  const file = formData.get("csv") as File | null;
  if (!file || file.size === 0) return;

  const rows = parseCsv(await file.text());
  if (rows.length < 2) return;

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from("categories").select("id, name");
  const categoryByName = new Map((categories ?? []).map((c) => [c.name.toLowerCase(), c.id]));

  let imported = 0;
  for (const row of rows.slice(1)) {
    const get = (key: string) => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? (row[idx] ?? "").trim() : "";
    };

    const name = get("name");
    const slug = get("slug") || slugify(name);
    if (!name || !slug) continue;

    const categoryName = get("category");
    let categoryId = categoryName ? categoryByName.get(categoryName.toLowerCase()) : undefined;
    if (categoryName && !categoryId) {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({ name: categoryName, slug: slugify(categoryName) })
        .select("id")
        .single();
      if (newCat) {
        categoryId = newCat.id;
        categoryByName.set(categoryName.toLowerCase(), newCat.id);
      }
    }

    const fields = {
      name,
      category_id: categoryId ?? null,
      description: get("description"),
      price: get("price") ? Number(get("price")) : null,
      compare_at_price: get("compare_at_price") ? Number(get("compare_at_price")) : null,
      stock: get("stock") ? Number(get("stock")) : null,
      is_featured: get("is_featured").toLowerCase() === "true",
      tags: get("tags") ? get("tags").split("|").map((t) => t.trim()).filter(Boolean) : [],
      is_active: get("is_active") ? get("is_active").toLowerCase() === "true" : true,
    };

    const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      await supabase.from("products").update(fields).eq("id", existing.id);
    } else {
      await supabase.from("products").insert({ ...fields, slug });
    }
    imported++;
  }

  revalidatePath("/admin/produits");
  revalidatePath("/", "layout");
}

export async function reorderProductImage(imageId: string, direction: "up" | "down") {
  const supabase = createServiceClient();
  const { data: image } = await supabase.from("product_images").select("id, product_id, sort_order").eq("id", imageId).single();
  if (!image) return;

  const { data: siblings } = await supabase
    .from("product_images")
    .select("id, sort_order")
    .eq("product_id", image.product_id)
    .order("sort_order", { ascending: true });
  if (!siblings) return;

  const index = siblings.findIndex((s) => s.id === imageId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const other = siblings[swapIndex];
  await supabase.from("product_images").update({ sort_order: other.sort_order }).eq("id", image.id);
  await supabase.from("product_images").update({ sort_order: image.sort_order }).eq("id", other.id);

  revalidatePath(`/admin/produits/${image.product_id}`);
  revalidatePath("/", "layout");
}
