-- Homepage content: singleton row holding every piece of text/media shown
-- on the public homepage (hero video, headings, copy, CTAs, philosophy
-- banner, marquee strip) so the client can edit it from
-- /admin/homepage instead of needing a code change + redeploy.
-- Same pattern as site_settings in 0002_shopify_features.sql.

create table homepage_content (
  id text primary key default 'default' check (id = 'default'),

  hero_video_url text not null default '/hero-video.mp4',
  hero_eyebrow text not null default 'New Season · Built To Move',
  hero_title_line1 text not null default 'Own Every',
  hero_title_line2 text not null default 'Street',
  hero_subtext text not null default 'We believe sweat should never dull your shine. Performance activewear for fearless athletes who own every stride and every street.',
  hero_cta_label text not null default 'Shop Now',
  hero_cta_href text not null default '/shop',

  instagram_handle text not null default 'figoactive',

  marquee_items text[] not null default array['Elevate Every Rep', 'Cash On Delivery', 'Free Shipping In Beirut', 'New Drops Weekly'],

  category_heading text not null default 'Shop by category',

  bestsellers_eyebrow text not null default 'Fan favorites',
  bestsellers_heading text not null default 'Bestsellers',

  philosophy_eyebrow text not null default 'The philosophy',
  philosophy_quote text not null default 'Inspired by the fear of being average',
  philosophy_image_url text,
  philosophy_cta_label text not null default 'Shop The Collection',

  newsletter_eyebrow text not null default 'Stay in the loop',
  newsletter_heading text not null default 'New drops, restocks and exclusive discounts',

  follow_eyebrow text not null default 'Follow along',

  updated_at timestamptz not null default now()
);

insert into homepage_content (id) values ('default') on conflict (id) do nothing;

-- Default-deny RLS, same posture as site_settings: reads/writes go through
-- createServiceClient() (secret key, bypasses RLS) from server-only code.
alter table homepage_content enable row level security;

-- Storage bucket for homepage media uploaded from the dashboard (philosophy
-- banner image). Mirrors the "products" bucket policy from 0001_init.sql.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "public read site assets" on storage.objects
  for select using (bucket_id = 'site-assets');

create policy "service role manages site assets" on storage.objects
  for all using (bucket_id = 'site-assets' and auth.role() = 'service_role');
