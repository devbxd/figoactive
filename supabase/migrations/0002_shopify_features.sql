-- Shopify-style dashboard features: coupons, orders, stock tracking,
-- featured/tagged products, manual related products, reviews, site
-- settings (announcement banner + newsletter popup), shipping zones,
-- payment methods, FAQ items, newsletter subscribers.
--
-- Everything here is read/written exclusively through service-role server
-- actions (same pattern as 0001_init.sql), so RLS stays default-deny on the
-- new tables except where a public policy is added to mirror 0001's
-- posture for genuinely public catalog-ish data.

-- ---------------------------------------------------------------------
-- Products: stock tracking, featured flag, tags
-- ---------------------------------------------------------------------
alter table products add column stock integer;
alter table products add column is_featured boolean not null default false;
alter table products add column tags text[] not null default '{}';

alter table product_variants add column stock integer;

-- ---------------------------------------------------------------------
-- Manually curated "related products" (falls back to same-category if empty)
-- ---------------------------------------------------------------------
create table product_relations (
  product_id uuid not null references products(id) on delete cascade,
  related_product_id uuid not null references products(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, related_product_id)
);

alter table product_relations enable row level security;

-- ---------------------------------------------------------------------
-- Product reviews (submitted on the site, moderated in the dashboard)
-- ---------------------------------------------------------------------
create table product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_reviews_product_id_idx on product_reviews(product_id);

alter table product_reviews enable row level security;
create policy "public read approved reviews" on product_reviews for select using (is_approved = true);

-- ---------------------------------------------------------------------
-- Coupons: percent / fixed / free-shipping, code-based or automatic
-- ---------------------------------------------------------------------
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  discount_type text not null check (discount_type in ('percent', 'fixed', 'free_shipping')),
  value numeric(10, 2) not null default 0,
  min_subtotal numeric(10, 2),
  usage_limit integer,
  times_used integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_automatic boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table coupons enable row level security;

-- ---------------------------------------------------------------------
-- Orders (nothing was persisted before this — checkout only emailed/
-- WhatsApp'd the order). Needed for order history, statuses, customer
-- list, analytics, coupon usage limits, and stock decrement.
-- ---------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text not null,
  city text not null,
  shipping_zone_label text not null,
  shipping_cost numeric(10, 2) not null default 0,
  payment_method text not null default 'Cash on delivery',
  subtotal numeric(10, 2) not null,
  discount_amount numeric(10, 2) not null default 0,
  coupon_code text,
  total numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  name text not null,
  variant_label text,
  price numeric(10, 2) not null,
  quantity integer not null,
  sort_order integer not null default 0
);

create index orders_created_at_idx on orders(created_at desc);
create index orders_phone_idx on orders(phone);
create index order_items_order_id_idx on order_items(order_id);

alter table orders enable row level security;
alter table order_items enable row level security;

-- Atomic stock decrements (guards against lost updates under concurrent
-- checkouts; no-ops when stock isn't tracked, i.e. it's null). Returns the
-- resulting stock level so the caller can trigger a low-stock warning.
create or replace function decrement_variant_stock(p_variant_id uuid, p_qty integer)
returns integer language sql as $$
  update product_variants set stock = greatest(stock - p_qty, 0)
  where id = p_variant_id and stock is not null
  returning stock;
$$;

create or replace function decrement_product_stock(p_product_id uuid, p_qty integer)
returns integer language sql as $$
  update products set stock = greatest(stock - p_qty, 0)
  where id = p_product_id and stock is not null
  returning stock;
$$;

create or replace function increment_coupon_usage(p_coupon_id uuid)
returns void language sql as $$
  update coupons set times_used = times_used + 1 where id = p_coupon_id;
$$;

-- ---------------------------------------------------------------------
-- Newsletter subscribers (previously the signup form didn't store anything)
-- ---------------------------------------------------------------------
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table subscribers enable row level security;

-- ---------------------------------------------------------------------
-- Site settings: singleton row for the announcement/sale banner and the
-- newsletter popup, editable from the dashboard instead of lib/site.ts.
-- ---------------------------------------------------------------------
create table site_settings (
  id text primary key default 'default' check (id = 'default'),
  banner_text text not null default '',
  banner_active boolean not null default false,
  banner_ends_at timestamptz,
  newsletter_popup_active boolean not null default false,
  newsletter_popup_coupon_code text,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values ('default') on conflict (id) do nothing;

alter table site_settings enable row level security;

-- ---------------------------------------------------------------------
-- Shipping zones (replaces the hardcoded SHIPPING_COST constant)
-- ---------------------------------------------------------------------
create table shipping_zones (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  cost numeric(10, 2) not null default 0,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

insert into shipping_zones (label, cost, sort_order) values
  ('Beirut', 4, 0),
  ('Outside Beirut', 6, 1);

alter table shipping_zones enable row level security;

-- ---------------------------------------------------------------------
-- Payment methods (replaces the hardcoded "Cash on delivery" block)
-- ---------------------------------------------------------------------
create table payment_methods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  instructions text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0
);

insert into payment_methods (label, instructions, sort_order) values
  ('Cash on delivery', 'Pay in cash when your order arrives.', 0);

alter table payment_methods enable row level security;

-- ---------------------------------------------------------------------
-- FAQ items (replaces the hardcoded array in app/faq/page.tsx)
-- ---------------------------------------------------------------------
create table faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0
);

insert into faq_items (question, answer, sort_order) values
  ('How do I place an order?', 'Add items to your cart, go to checkout and fill in your details. Orders are confirmed by WhatsApp and paid on delivery — no card needed.', 0),
  ('What payment methods do you accept?', 'Cash on delivery only, for now. You pay when your order arrives.', 1),
  ('How much is shipping?', 'Shipping cost depends on your area — it''s shown at checkout before you confirm your order.', 2),
  ('How long does delivery take?', 'Most orders arrive within 1-3 business days depending on your area. We''ll confirm a delivery window with you on WhatsApp after you order.', 3),
  ('Can I return or exchange an item?', 'Yes — returns and exchanges are accepted within 7 days if the item hasn''t been worn and is in its original packaging. Message us on WhatsApp to start a return.', 4),
  ('How do I know my size?', 'Each product page with size options has a size guide chart under the product description. Still unsure? Message us on WhatsApp with your measurements and we''ll help you pick.', 5),
  ('Do you restock sold-out items?', 'Restocks happen regularly. Follow @figoactive on Instagram or sign up to our newsletter to hear about new drops and restocks first.', 6);

alter table faq_items enable row level security;
create policy "public read faq items" on faq_items for select using (true);
