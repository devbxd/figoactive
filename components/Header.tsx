"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { BRAND_NAME, SALE_LABEL, SALE_ENDS_AT } from "@/lib/site";
import { CountdownBanner } from "./CountdownBanner";
import { SearchBar } from "./SearchBar";

export function Header({ categories }: { categories: string[] }) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the homepage the header floats transparent over the hero image until
  // the visitor scrolls, then solidifies — everywhere else it's always solid
  // since there's no dark hero behind it to float over.
  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <header
      className={`top-0 z-40 w-full text-white transition-colors duration-300 ${
        // On the homepage the header is taken out of the document flow
        // (fixed) so it can overlap the hero image with no reserved space
        // above it — sticky would still occupy its own box at the top and
        // just show the white page background behind it instead of the
        // hero. Every other page keeps sticky, which is what already makes
        // the page content flow correctly below it.
        isHome ? "fixed" : "sticky"
      } ${transparent ? "bg-transparent" : "bg-brand-navy shadow-[0_1px_0_rgba(255,255,255,0.08)]"}`}
    >
      <CountdownBanner label={SALE_LABEL} endsAt={SALE_ENDS_AT} />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className="h-[1.5px] w-5 bg-white" />
          <span className="h-[1.5px] w-5 bg-white" />
          <span className="h-[1.5px] w-5 bg-white" />
        </button>

        <Link href="/" className="font-heading text-xl font-bold uppercase tracking-[0.2em]">
          {BRAND_NAME}
        </Link>

        <nav className="hidden items-center gap-8 font-heading text-xs font-semibold uppercase tracking-[0.15em] md:flex">
          <Link href="/" className="transition-colors hover:text-brand-mint">
            Home
          </Link>
          <Link href="/shop" className="transition-colors hover:text-brand-mint">
            Shop
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="transition-colors hover:text-brand-mint"
            >
              {c}
            </Link>
          ))}
          <Link href="/faq" className="transition-colors hover:text-brand-mint">
            FAQ
          </Link>
          <Link href="/contact" className="transition-colors hover:text-brand-mint">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden md:block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              <path
                d="M12 20.5s-7.5-4.8-9.8-9.6C.7 7.4 2.3 4 5.7 3.3c2-.4 4 .5 5.3 2.4 1.3-1.9 3.3-2.8 5.3-2.4 3.4.7 5 4.1 3.5 7.6-2.3 4.8-9.8 9.6-9.8 9.6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path
                d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-mint text-[10px] font-bold text-brand-navy">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 bg-brand-navy px-4 py-3 md:px-6">
          <div className="mx-auto flex max-w-6xl">
            <SearchBar dark onSubmit={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-brand-navy px-4 py-3 font-heading text-sm uppercase tracking-wide md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-2">
            Home
          </Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-2">
            Shop
          </Link>
          {categories.map((c) => (
            <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`} onClick={() => setMenuOpen(false)} className="py-2 pl-4 text-white/80">
              {c}
            </Link>
          ))}
          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="py-2">
            Wishlist
          </Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className="py-2">
            FAQ
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="py-2">
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
