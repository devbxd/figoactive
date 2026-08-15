import type { Metadata } from "next";
import { Oswald, Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { BRAND_NAME, SITE_URL } from "@/lib/site";

const heading = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-heading" });
const body = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND_NAME} — Elevate Your Urban Workout`, template: `%s — ${BRAND_NAME}` },
  description:
    "Performance activewear for fearless athletes who own every stride and every street. Sports bras, leggings, shorts and sets built to move with you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen bg-white font-sans text-brand-black antialiased">
        <WishlistProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <BottomNav />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
