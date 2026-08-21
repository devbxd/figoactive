import { createServiceClient } from "@/lib/supabase/server";

const HEADERS = ["slug", "name", "category", "description", "price", "compare_at_price", "stock", "is_featured", "tags", "is_active"];

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toRow(values: string[]) {
  return values.map(csvEscape).join(",");
}

export async function GET() {
  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("slug, name, description, price, compare_at_price, stock, is_featured, tags, is_active, category:categories(name)")
    .order("created_at", { ascending: false });

  const rows = ((products as any[]) ?? []).map((p) => {
    const category = Array.isArray(p.category) ? p.category[0] : p.category;
    return toRow([
      p.slug,
      p.name,
      category?.name ?? "",
      p.description ?? "",
      p.price != null ? String(p.price) : "",
      p.compare_at_price != null ? String(p.compare_at_price) : "",
      p.stock != null ? String(p.stock) : "",
      p.is_featured ? "true" : "false",
      (p.tags ?? []).join("|"),
      p.is_active ? "true" : "false",
    ]);
  });

  const csv = [toRow(HEADERS), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=products.csv",
    },
  });
}
