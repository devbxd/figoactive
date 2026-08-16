import Link from "next/link";
import { BRAND_NAME, INSTAGRAM_HANDLE, whatsappLink } from "@/lib/site";
import { CATEGORIES } from "@/lib/products";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-brand-black px-4 py-12 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <p className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-white">{BRAND_NAME}</p>
          <p className="mt-3 text-sm leading-relaxed">
            Inspired by the fear of being average. Performance activewear for fearless athletes who own every
            stride and every street.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.15em] text-white">Get 10% off your first order</p>
          <div className="mt-2">
            <NewsletterForm dark />
          </div>
        </div>

        <div>
          <p className="font-heading text-xs uppercase tracking-[0.15em] text-white">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-brand-mint">
                All products
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/shop?category=${encodeURIComponent(c)}`} className="hover:text-brand-mint">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs uppercase tracking-[0.15em] text-white">Customer Area</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/contact" className="hover:text-brand-mint">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-brand-mint">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-brand-mint">
                FAQ
              </Link>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-mint">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs uppercase tracking-[0.15em] text-white">Follow</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-mint"
              >
                Instagram @{INSTAGRAM_HANDLE}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
