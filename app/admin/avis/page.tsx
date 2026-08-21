import { createServiceClient } from "@/lib/supabase/server";
import { approveReview, deleteReview } from "./actions";

export default async function AdminReviewsPage() {
  const supabase = createServiceClient();
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("id, customer_name, rating, comment, is_approved, created_at, product:products(name)")
    .order("created_at", { ascending: false });

  const pending = (reviews ?? []).filter((r: any) => !r.is_approved);
  const approved = (reviews ?? []).filter((r: any) => r.is_approved);

  function Row({ r }: { r: any }) {
    const product = Array.isArray(r.product) ? r.product[0] : r.product;
    return (
      <div className="flex flex-col gap-2 border-b border-neutral-100 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {r.customer_name} <span className="text-brand-mint">{"★".repeat(r.rating)}</span>
            <span className="text-neutral-300">{"★".repeat(5 - r.rating)}</span>
          </p>
          <p className="text-xs text-neutral-500">{product?.name ?? "Unknown product"}</p>
          {r.comment && <p className="mt-1 text-sm text-neutral-700">{r.comment}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-4 text-sm">
          {!r.is_approved && (
            <form action={approveReview.bind(null, r.id)}>
              <button className="text-emerald-700 hover:underline">Approve</button>
            </form>
          )}
          <form action={deleteReview.bind(null, r.id)}>
            <button className="text-neutral-600 hover:text-red-600">Delete</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Reviews</h1>

      <div className="max-w-2xl">
        <h2 className="mb-1 font-heading text-sm uppercase tracking-wide text-neutral-500">
          Pending approval {pending.length > 0 && <span>({pending.length})</span>}
        </h2>
        <div className="border-t border-neutral-100">
          {pending.map((r: any) => (
            <Row key={r.id} r={r} />
          ))}
          {pending.length === 0 && <p className="py-4 text-sm text-neutral-500">Nothing pending.</p>}
        </div>

        <h2 className="mb-1 mt-8 font-heading text-sm uppercase tracking-wide text-neutral-500">Approved</h2>
        <div className="border-t border-neutral-100">
          {approved.map((r: any) => (
            <Row key={r.id} r={r} />
          ))}
          {approved.length === 0 && <p className="py-4 text-sm text-neutral-500">No approved reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
