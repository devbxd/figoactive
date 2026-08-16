import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { MetaPixel } from "@/components/MetaPixel";
import { BRAND_NAME, SITE_URL } from "@/lib/site";
import { getCategories } from "@/lib/products";

// Oswald (condensed, bold, athletic) for headings/accents; Inter (clean,
// neutral grotesque) for body text — swapped from the rounder Quicksand
// found on the client's old Shopify theme for a more premium, editorial
// feel closer to the oneractive.com reference they sent.
const heading = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND_NAME} — Elevate Your Urban Workout`, template: `%s — ${BRAND_NAME}` },
  description:
    "Performance activewear for fearless athletes who own every stride and every street. Sports bras, leggings, shorts and sets built to move with you.",
  // Meta Business Manager domain verification, for Instagram/Facebook Shop setup.
  other: { "facebook-domain-verification": "mlbamns2mt3ctpm1yc0c3o96sxfpby" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const categories = await getCategories();

  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen bg-white font-sans text-brand-black antialiased">
        {metaPixelId && <MetaPixel pixelId={metaPixelId} />}
        <WishlistProvider>
          <CartProvider>
            <Header categories={categories} />
            {children}
            <Footer />
            <BottomNav />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
