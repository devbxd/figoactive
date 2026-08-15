import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center md:px-6">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Page not found</h1>
      <Link
        href="/"
        className="mt-6 inline-block bg-brand-navy px-8 py-3 font-heading text-sm uppercase tracking-widest text-white hover:opacity-90"
      >
        Back home
      </Link>
    </main>
  );
}
