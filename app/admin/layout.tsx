import Link from "next/link";
import { signOut } from "./login/actions";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/produits", label: "Products" },
  { href: "/admin/commandes", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/clients", label: "Customers" },
  { href: "/admin/avis", label: "Reviews" },
  { href: "/admin/parametres", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-white p-4 md:block">
        <p className="mb-6 font-heading text-lg font-bold uppercase tracking-wide text-brand-navy">Dashboard</p>
        <nav className="space-y-1 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded px-3 py-2 hover:bg-neutral-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-8">
          <button className="w-full rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
            Log out
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <nav className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
          <div className="flex gap-4 text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-navy">
                {item.label}
              </Link>
            ))}
          </div>
          <form action={signOut}>
            <button className="text-sm text-neutral-500">Log out</button>
          </form>
        </nav>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
