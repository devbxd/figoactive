import { PRODUCTS } from "@/lib/products";
import { SITE_URL, BRAND_NAME } from "@/lib/site";

// Meta Commerce Manager product feed (CSV). Paste this route's URL into
// Commerce Manager's "Data feed" setup — Meta re-fetches it on a schedule,
// so new products / price / stock changes here show up automatically once
// this is deployed, no manual re-upload needed.
// Field reference: https://www.facebook.com/business/help/120325381656392

const HEADERS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "additional_image_link",
  "brand",
];

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toRow(values: string[]) {
  return values.map(csvEscape).join(",");
}

export async function GET() {
  const rows = PRODUCTS.map((p) => {
    const inStock = p.variants.length === 0 || p.variants.some((v) => v.available);
    return toRow([
      p.slug,
      p.name,
      p.description || `${p.name} — ${BRAND_NAME}`,
      inStock ? "in stock" : "out of stock",
      "new",
      `${p.price.toFixed(2)} USD`,
      `${SITE_URL}/shop/${p.slug}`,
      `${SITE_URL}${p.images[0] ?? ""}`,
      p.images.slice(1).map((img) => `${SITE_URL}${img}`).join(","),
      BRAND_NAME,
    ]);
  });

  const csv = [toRow(HEADERS), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
