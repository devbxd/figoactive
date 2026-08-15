import { createClient } from "@/lib/supabase/server";
import { createCategory } from "./actions";
import { CategoryRow } from "./CategoryRow";
import { SubmitButton } from "@/components/SubmitButton";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  const all = categories ?? [];
  const counts = new Map<string, number>();
  await Promise.all(
    all.map(async (c) => {
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("category_id", c.id);
      counts.set(c.id, count ?? 0);
    })
  );

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Categories</h1>

      <form action={createCategory} className="mb-8 flex max-w-md gap-2">
        <input
          name="name"
          required
          placeholder="New category (e.g. Sports Bras)"
          className="flex-1 border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
        />
        <SubmitButton className="shrink-0 bg-brand-navy px-5 py-2 text-sm uppercase tracking-wide text-white hover:opacity-90">
          Add
        </SubmitButton>
      </form>

      <div className="max-w-2xl border-t border-neutral-100">
        {all.map((c) => (
          <CategoryRow key={c.id} category={c} productCount={counts.get(c.id) ?? 0} />
        ))}
        {all.length === 0 && <p className="py-6 text-sm text-neutral-500">No categories yet.</p>}
      </div>
    </div>
  );
}
