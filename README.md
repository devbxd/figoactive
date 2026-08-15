# Figo Active

Storefront for Figo Active (activewear). Built the same way as houseofoptics
(Next.js + Tailwind) but **without an admin dashboard**, per the client's
choice — there is no database, no login, and no way for the client to edit
products from the site itself.

## How this was built

The product catalog (17 products, images, prices, color/size variants,
descriptions) was pulled from figoactive.com's live Shopify store
(`/products.json`) on 2026-08-15. Design (colors `#1D2236` navy / `#6FE7DB`
mint, fonts Oswald + Quicksand) and copy ("Elevate your urban workout", "we
believe sweat should never dull your shine"...) were taken from
figoactive.com and the @figoactive Instagram.

## Editing products (no dashboard)

Open `lib/products.ts` and edit the `PRODUCTS` array directly — add, remove,
or change any product's name/price/images/variants/description there, then
redeploy. Product images live in `public/products/<slug>/`.

A Supabase-backed admin dashboard (Categories + Products CRUD at `/admin`)
was built and then put on hold — the client may or may not want it. That
work is still in git history (commit `dbd79e2`, reverted in `0400fb9`) and
can be restored later without starting over.

## "Special" touches (after the client sent oneractive.com as a reference)

- Countdown-timer promo banner on the homepage (`lib/site.ts` →
  `SALE_LABEL` / `SALE_ENDS_AT` — update the date manually, it just
  disappears once it passes).
- Quick-add-to-cart on hover, for products with no color/size options.
- "-X%" badge computed from the compare-at price.
- "Shop by category" image tiles on the homepage.
- Newsletter signup (homepage + footer) — front-end only for now, doesn't
  store the email anywhere yet (no backend without Supabase); wire it to
  Resend or Supabase once one is set up.
- Size guide chart on product pages that have sizes (generic reference
  measurements — swap in Figo Active's real chart when they provide one).
- Scroll-reveal animations on homepage sections.

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
  yet on the live Shopify store, so they show "Details coming soon." here
  too — same content gap, not something introduced by this rebuild.

## Local development

```bash
npm install
npm run dev
```

Site: http://localhost:3000
