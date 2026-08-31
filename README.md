# Figo Active

Storefront + admin dashboard for Figo Active (activewear). Next.js +
Tailwind + Supabase (Postgres, storage, auth for the admin login).

## Editing the site

Everything — products, categories, coupons, orders, shipping zones,
payment methods, the homepage announcement banner, newsletter popup, FAQ,
reviews, and now every piece of homepage content (hero video, headings,
text, philosophy banner image, marquee strip) — is managed from `/admin`
(Supabase Auth login). Nothing here requires editing code or redeploying.

Apply `supabase/migrations/*.sql` in order against your Supabase project
before running the app for the first time; `scripts/seed.mjs` seeds the
original catalog + creates the admin user (see the comment at the top of
that file).

## Dashboard sections

- **Products** — name, price, discount (compare-at price, product- and
  variant-level), stock tracking, tags, "featured on homepage" flag,
  manually curated related products, duplicate/import/export (CSV),
  drag-free image reordering.
- **Homepage** (`/admin/homepage`) — hero video URL, hero eyebrow/title/
  subtext/button, Instagram handle, marquee strip items, category-section
  heading, bestsellers eyebrow/heading, "philosophy" banner (image upload
  or URL, eyebrow, quote, button), newsletter section text, "follow along"
  eyebrow. Covers every hardcoded string/media on `/`.
- **Categories** — simple CRUD.
- **Orders** — every checkout is now persisted (it used to only email/
  WhatsApp the owner and store nothing); status tracking, search/filter,
  CSV export.
- **Coupons** — percent / fixed / free-shipping, code-based or automatic
  (no code needed), minimum order, expiry, usage limits, usage stats.
- **Customers** — derived from order history (no customer accounts on
  this site).
- **Reviews** — customers submit from the product page; moderated here
  before they show up on the site.
- **Settings** — announcement/countdown banner, newsletter popup + its
  discount code, shipping zones, payment methods, FAQ content.

## "Special" touches (after the client sent oneractive.com as a reference)

- Countdown-timer promo banner on the homepage, editable from
  `/admin/parametres`.
- Quick-add-to-cart on hover, for products with no color/size options.
- "-X%" badge computed from the compare-at price (product or variant).
- "Shop by category" image tiles on the homepage.
- Newsletter signup (homepage, footer, and a popup) — stored in the
  `subscribers` table.
- Size guide chart on product pages that have sizes (generic reference
  measurements — swap in Figo Active's real chart when they provide one).
- Scroll-reveal animations on homepage sections.
- Looping background video in the hero (`public/hero-video.mp4`) — a
  royalty-free Pexels clip (pexels.com/video/8457013, free-to-use license,
  no attribution required), not a YouTube download: YouTube videos stay
  copyrighted to the uploader even when they look "free," and reusing
  footage of an identifiable real person without a proper release is a
  real risk for the client. Swap this file for real Figo Active footage
  whenever they have some — same filename, same spot, or just paste a new
  video URL from `/admin/homepage` (no redeploy needed either way).

## Confirmed with the client

- WhatsApp number (`96176963942` in `lib/site.ts`) — correct.
- Cash on delivery as the default payment method — more methods can be
  added from `/admin/parametres` without a code change.
- Keep the "Send it via WhatsApp too" button on the order confirmation
  screen — this is still the fastest way an order reaches the owner,
  alongside the order now also being saved in the dashboard.

## Still open

- **Contact email**: no public email was found anywhere for Figo Active —
  `lib/site.ts` currently has a placeholder (`hello@figoactive.com`).
- **Order notifications**: without RESEND_API_KEY + OWNER_NOTIFICATION_EMAIL
  set (see `.env.example`), the WhatsApp button above and the Orders
  dashboard are the only ways an order reaches the owner — email
  notification is optional on top of that.
- Several products (Dolmation Set, Pull-Puff Set, Airflow Bra, Aura Bra,
  Lili Biker Shorts, Athletica Bra, Bouba Flare Pants) have no description
  yet on the live Shopify store, so they show "Details coming soon." here
  too — same content gap, not something introduced by this rebuild.

## Local development

```bash
npm install
npm run dev
```

Site: http://localhost:3000
