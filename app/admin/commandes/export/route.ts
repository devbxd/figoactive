import { createServiceClient } from "@/lib/supabase/server";

const HEADERS = ["date", "order_id", "name", "phone", "address", "city", "items", "subtotal", "discount", "shipping", "total", "coupon_code", "status"];

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toRow(values: string[]) {
  return values.map(csvEscape).join(",");
}

export async function GET() {
  const supabase = createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, name, phone, address, city, subtotal, discount_amount, shipping_cost, total, coupon_code, status, items:order_items(name, variant_label, quantity)")
    .order("created_at", { ascending: false });

  const rows = ((orders as any[]) ?? []).map((o) => {
    const itemsText = (o.items ?? [])
      .map((i: any) => `${i.quantity}x ${i.name}${i.variant_label ? ` (${i.variant_label})` : ""}`)
      .join("; ");
    return toRow([
      new Date(o.created_at).toISOString(),
      o.id,
      o.name,
      o.phone,
      `${o.address}, ${o.city}`,
      itemsText,
      Number(o.subtotal).toFixed(2),
      Number(o.discount_amount).toFixed(2),
      Number(o.shipping_cost).toFixed(2),
      Number(o.total).toFixed(2),
      o.coupon_code ?? "",
      o.status,
    ]);
  });

  const csv = [toRow(HEADERS), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=orders.csv",
    },
  });
}
