# Figo Active

Storefront + admin dashboard for Figo Active (activewear). Built the same
way as houseofoptics (Next.js + Tailwind + Supabase), scoped down: the
dashboard only manages **Categories** and **Products** — no theme/font/
footer/hero editors, no orders backend. The public design is fixed in code.

## How this was built

The product catalog (17 products, images, prices, color/size variants,
descriptions) was originally pulled from figoactive.com's live Shopify
store (`/products.json`) on 2026-08-15, then migrated into Supabase (see
`supabase/migrations/0002_seed_products.sql`). Design (colors `#1D2236`
navy / `#6FE7DB` mint, fonts Oswald + Quicksand) and copy ("Elevate your
urban workout", "we believe sweat should never dull your shine"...) were
taken from figoactive.com and the @figoactive Instagram.

## 1. Set up Supabase

1. Create a project at supabase.com (a **new, separate** project from
   houseofoptics's — different client, different data).
2. Project Settings → API: copy `Project URL`, `anon public` key, and
   `service_role` key into `.env.local` (see `.env.example`).
3. SQL Editor: run, in order —
   - `supabase/migrations/0001_init.sql` (schema, RLS, storage bucket)
   - `supabase/migrations/0002_seed_products.sql` (the 17 real products)
   - `supabase/migrations/0003_newsletter.sql` (newsletter signup table)
4. Authentication → Users: create the admin login (email + password) used
   to sign in at `/admin`.

## 2. Local development

```bash
npm install
npm run dev
```

Site: http://localhost:3000 — Dashboard: http://localhost:3000/admin

## Dashboard scope (Categories + Products only)

- Add/rename/delete categories.
- Add/edit/delete products: name, category, price, compare-at price (shows
  a sale badge automatically), description, photos, color/size options.
- Everything else (WhatsApp number, shipping rates, sale countdown banner,
  homepage copy, fonts/colors) lives in code (`lib/site.ts`, `app/page.tsx`)
  and needs a code change + redeploy to update.

## "Special" touches added after the client's oneractive.com reference

- Countdown-timer promo banner on the homepage (`lib/site.ts` →
  `SALE_LABEL` / `SALE_ENDS_AT` — update the date manually, it just
  disappears once it passes).
- Quick-add-to-cart on hover, for products with no color/size options.
- "-X%" badge computed from compare-at price.
- "Shop by category" image tiles on the homepage.
- Newsletter signup (homepage + footer) — stored in `newsletter_subscribers`.
- Size guide chart on product pages that have sizes (generic reference
  measurements — swap in Figo Active's real chart when they provide one).
- Scroll-reveal animations on homepage sections.

Not built (would need real infrastructure this project doesn't have):
customer accounts, a loyalty/points program, back-in-stock email alerts,
card payments — flagged here so nothing is assumed done.

## Confirmed with the client

- WhatsApp number (`96176963942` in `lib/site.ts`) — correct.
- Cash on delivery as the only payment method — fine, no card gateway needed.
- Keep the "Send it via WhatsApp too" button on the order confirmation
  screen — this is the main way an order reaches the owner.

## Still open

- **Contact email**: no public email was found anywhere for Figo Active —
  `lib/site.ts` currently has a placeholder (`hello@figoactive.com`).
- **Order notifications**: without RESEND_API_KEY + OWNER_NOTIFICATION_EMAIL
  set (see `.env.example`), the WhatsApp button above is the only way an
  order reaches the owner — email notification is optional on top of that.
- Several products (Dolmation Set, Pull-Puff Set, Airflow Bra, Aura Bra,
  Lili Biker Shorts, Athletica Bra, Bouba Flare Pants) have no description
  yet — same content gap that existed on the original Shopify store, editable
  now from the dashboard.
- Real size-guide measurements from the client, to replace the generic chart.
