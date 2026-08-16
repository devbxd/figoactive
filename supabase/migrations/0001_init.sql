-- Schema for the Figo Active catalog + admin dashboard (Categories and
-- Products only — no site-wide settings, theme, or other admin sections;
-- the public design is fixed in code per the client's request).

create extension if not exists "pgcrypto";

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2),
  compare_at_price numeric(10, 2),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_label text,
  size_label text,
  price numeric(10, 2),
  compare_at_price numeric(10, 2),
  available boolean not null default true,
  sort_order integer not null default 0
);

create index products_category_id_idx on products(category_id);
create index product_images_product_id_idx on product_images(product_id);
create index product_variants_product_id_idx on product_variants(product_id);

-- Row Level Security: public read on catalog data, writes only via the
-- secret key used by admin server actions (never exposed to the browser).
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (is_active = true);
create policy "public read product_images" on product_images for select using (true);
create policy "public read product_variants" on product_variants for select using (true);

-- Public storage bucket for product photos uploaded from the admin dashboard.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product photos" on storage.objects
  for select using (bucket_id = 'products');

create policy "service role manages product photos" on storage.objects
  for all using (bucket_id = 'products' and auth.role() = 'service_role');
