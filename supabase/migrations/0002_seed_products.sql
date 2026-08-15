-- One-time seed of the 17 products scraped from figoactive.com on 2026-08-15
-- (see lib/products.ts in git history for the original static version this replaces).

-- Categories
insert into categories (id, name, slug, sort_order) values ('46a45819-c447-46b6-a112-8d451cf111fc', 'Sets', 'sets', 0);
insert into categories (id, name, slug, sort_order) values ('c04ecdac-399c-432c-927c-131602f3da52', 'Sports Bras', 'sports-bras', 1);
insert into categories (id, name, slug, sort_order) values ('636bf6b7-221c-432b-99c5-fcda41a348dd', 'Shorts', 'shorts', 2);
insert into categories (id, name, slug, sort_order) values ('cf707b06-34cd-468a-b5f6-1e2b4255a369', 'Leggings & Pants', 'leggings-pants', 3);

-- Dolmation Set
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('8dc740d3-13dc-46b0-995f-d3ded9fa3aca', '46a45819-c447-46b6-a112-8d451cf111fc', 'Dolmation Set', 'dolmation-set', '', 50, 65, 0);
insert into product_images (product_id, url, sort_order) values ('8dc740d3-13dc-46b0-995f-d3ded9fa3aca', '/products/dolmation-set/1.jpg', 0);

-- Pull-Puff Set
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('16ade198-9777-4ec2-a47a-41ddbbc02d13', '46a45819-c447-46b6-a112-8d451cf111fc', 'Pull-Puff Set', 'pull-puff-set', '', 50, 65, 0);
insert into product_images (product_id, url, sort_order) values ('16ade198-9777-4ec2-a47a-41ddbbc02d13', '/products/pull-puff-set/1.png', 0);
insert into product_images (product_id, url, sort_order) values ('16ade198-9777-4ec2-a47a-41ddbbc02d13', '/products/pull-puff-set/2.png', 1);

-- The Airflow Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('6e41e19a-bdff-4525-9cf1-fd1c06ba9354', 'c04ecdac-399c-432c-927c-131602f3da52', 'The Airflow Bra', 'the-airflow-bra', '', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('6e41e19a-bdff-4525-9cf1-fd1c06ba9354', '/products/the-airflow-bra/1.png', 0);
insert into product_images (product_id, url, sort_order) values ('6e41e19a-bdff-4525-9cf1-fd1c06ba9354', '/products/the-airflow-bra/2.png', 1);
insert into product_images (product_id, url, sort_order) values ('6e41e19a-bdff-4525-9cf1-fd1c06ba9354', '/products/the-airflow-bra/3.png', 2);

-- Aura Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('5f7c8f62-ce03-4e8c-8cc6-13d0cfa35bdf', 'c04ecdac-399c-432c-927c-131602f3da52', 'Aura Bra', 'aura-bra', '', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('5f7c8f62-ce03-4e8c-8cc6-13d0cfa35bdf', '/products/aura-bra/1.jpg', 0);
insert into product_images (product_id, url, sort_order) values ('5f7c8f62-ce03-4e8c-8cc6-13d0cfa35bdf', '/products/aura-bra/2.jpg', 1);

-- Lili Biker Shorts
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('4a038acd-c604-4650-bff9-624fa0e1d768', '636bf6b7-221c-432b-99c5-fcda41a348dd', 'Lili Biker Shorts', 'lili-biker-shorts', '', 15, null, 0);
insert into product_images (product_id, url, sort_order) values ('4a038acd-c604-4650-bff9-624fa0e1d768', '/products/lili-biker-shorts/1.png', 0);

-- Athletica Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('de601242-f86d-4247-99d7-275f5e8b9637', 'c04ecdac-399c-432c-927c-131602f3da52', 'Athletica Bra', 'athletica-bra', '', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('de601242-f86d-4247-99d7-275f5e8b9637', '/products/athletica-bra/1.png', 0);
insert into product_images (product_id, url, sort_order) values ('de601242-f86d-4247-99d7-275f5e8b9637', '/products/athletica-bra/2.png', 1);

-- Bouba Flare Pants
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('ce7f8179-2ba9-4342-985b-34017fc2b246', 'cf707b06-34cd-468a-b5f6-1e2b4255a369', 'Bouba Flare Pants', 'bouba-flare-pants', '', 20, 27, 0);
insert into product_images (product_id, url, sort_order) values ('ce7f8179-2ba9-4342-985b-34017fc2b246', '/products/bouba-flare-pants/1.png', 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ce7f8179-2ba9-4342-985b-34017fc2b246', 'Black', null, 20, 27, true, 0);

-- Kintex Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'c04ecdac-399c-432c-927c-131602f3da52', 'Kintex Bra', 'kintex-bra', '🕊️ Peace – Find your calm in the chaos. Solace is your sanctuary, offering gentle support and a soothing fit that brings stillness to your busiest days.
🌊 Balance – Life is about harmony. Solace is crafted to align comfort and support perfectly, helping you stay centered no matter what the day brings.
🌙 Restoration – Rest is power. Honor your body''s need to recover, wrapping you in softness that helps you recharge and come back stronger.
💫 Resilience – Even on the hardest days, you rise. A reminder that you are capable of bouncing back, standing tall, and beginning again.', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', '/products/kintex-bra/1.jpg', 0);
insert into product_images (product_id, url, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', '/products/kintex-bra/2.jpg', 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Black', 'S', 17.5, 25, true, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Citron', 'S', 17.5, 25, true, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Black', 'M', 17.5, 25, true, 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Black', 'L', 17.5, 25, true, 3);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Black', 'XL', 17.5, 25, true, 4);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Black', '2XL', 17.5, 25, true, 5);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Citron', 'M', 17.5, 25, true, 6);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Citron', 'L', 17.5, 25, true, 7);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Citron', 'XL', 17.5, 25, true, 8);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ab57de9c-1591-405e-b3de-91eebd48aeb1', 'Citron', '2XL', 17.5, 25, true, 9);

-- Solace Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', 'c04ecdac-399c-432c-927c-131602f3da52', 'Solace Bra', 'solace-bra', '🕊️ Peace – Find your calm in the chaos. Solace is your sanctuary, offering gentle support and a soothing fit that brings stillness to your busiest days.
🌊 Balance – Life is about harmony. Solace is crafted to align comfort and support perfectly, helping you stay centered no matter what the day brings.
🌙 Restoration – Rest is power. Solace honors your body''s need to recover, wrapping you in softness that helps you recharge and come back stronger.
💫 Resilience – Even on the hardest days, you rise. Solace is a reminder that you are capable of bouncing back, standing tall, and beginning again.', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', '/products/solace-bra/1.jpg', 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', null, 'S', 17.5, 25, true, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', null, 'M', 17.5, 25, true, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', null, 'L', 17.5, 25, true, 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', null, 'XL', 17.5, 25, true, 3);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ee79cacf-e823-4b71-8db0-3ccc223915e0', null, '2XL', 17.5, 25, true, 4);

-- Velour Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', 'c04ecdac-399c-432c-927c-131602f3da52', 'Velour Bra', 'velour-bra', '🛡️ Protection – Velour wraps you in a layer of luxurious softness that shields your skin from irritation, keeping you comfortable through every rep and stretch.
❤️ Self-Love – Because you deserve to treat yourself. Velour reminds you that caring for your body is the most powerful thing a woman can do.
🌸 Grace – Move with elegance and ease. Velour''s plush fabric flows with your body, making every movement feel effortlessly beautiful.
✨ Endurance – Soft on the outside, strong on the inside. Velour is built to last through long days, tough sessions, and everything in between.', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', '/products/velour-bra/1.png', 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', 'Black', 'S', 17.5, 25, true, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', 'Black', 'M', 17.5, 25, true, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', 'Black', 'L', 17.5, 25, true, 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', 'Black', 'XL', 17.5, 25, true, 3);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('058e2c0c-a2be-4f67-9f3b-15ae9f814cb0', 'Black', '2XL', 17.5, 25, true, 4);

-- Lumière Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'c04ecdac-399c-432c-927c-131602f3da52', 'Lumière Bra', 'lumiere-bra', '💪 Strength – Built to empower every move you make, Lumière gives you the support to lift higher, push harder, and shine brighter in every workout.
🔥 Motivation – When you wear Lumière, you ignite a fire within. Designed for women who refuse to slow down and always chase their best self.
🌟 Confidence – Feel radiant from the inside out. Lumière''s sleek, seamless design makes you stand tall and own every room you walk into.
🦋 Freedom – Lightweight and barely-there, Lumière lets your body move without limits — because true freedom starts with how you feel.', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', '/products/lumiere-bra/1.png', 0);
insert into product_images (product_id, url, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', '/products/lumiere-bra/2.png', 1);
insert into product_images (product_id, url, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', '/products/lumiere-bra/3.png', 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Black', 'S', 17.5, 25, true, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'White', 'S', 17.5, 25, true, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Sweet rose', 'S', 17.5, 25, true, 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Black', 'M', 17.5, 25, true, 3);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Black', 'L', 17.5, 25, true, 4);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Black', 'XL', 17.5, 25, true, 5);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Black', '2XL', 17.5, 25, true, 6);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'White', 'M', 17.5, 25, true, 7);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'White', 'L', 17.5, 25, true, 8);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'White', 'XL', 17.5, 25, true, 9);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'White', '2XL', 17.5, 25, true, 10);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Sweet rose', 'M', 17.5, 25, true, 11);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Sweet rose', 'L', 17.5, 25, true, 12);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Sweet rose', 'XL', 17.5, 25, true, 13);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('ca779a1b-df8a-409e-9bcc-4e37533aadd3', 'Sweet rose', '2XL', 17.5, 25, true, 14);

-- Kai Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('a2a564c6-7d39-47b9-a500-a384ca5a2442', 'c04ecdac-399c-432c-927c-131602f3da52', 'Kai Bra', 'kai-bra', '. ⚡Ignite Your Potential : Unlock explosive energy and high-intensity performance with apparel built to handle your fastest, most powerful movements.


. 🌊Command Your Flow : Experience the seamless, fluid support of gear that adapts to your body, keeping you centered throughout every complex workout.


. 🏆Master the Discipline: Elevate your standard with premium designs that honor the dedication, consistency, and excellence you bring to your training.


. 🏔️Unlock Your Peak : Reach new heights of personal achievement with resilient, top-tier performance wear that supports you at every stage of the journey.', 25, null, 0);
insert into product_images (product_id, url, sort_order) values ('a2a564c6-7d39-47b9-a500-a384ca5a2442', '/products/kai-bra/1.jpg', 0);
insert into product_images (product_id, url, sort_order) values ('a2a564c6-7d39-47b9-a500-a384ca5a2442', '/products/kai-bra/2.jpg', 1);

-- Lowell Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('e64518e0-f560-450f-bb87-92c8b383eb4e', 'c04ecdac-399c-432c-927c-131602f3da52', 'Lowell Bra', 'lowell-bra', '. 🏃Advanced Moisture-Wicking Fabric: Stay cool and dry throughout your toughest sessions with high-performance, breathable materials.


  . 💪Precision Ergonomic Support: Experience an optimized, secure fit that moves naturally with your body during high-intensity training.


 . 🎯Strategic Ventilation Zones: Benefit from integrated mesh detailing designed for enhanced airflow and comfort during peak activity.


 . 🏋️Minimalist Modern Aesthetic: Elevate your workout wardrobe with clean lines and a refined silhouette that bridges function and contemporary style.', 25, null, 0);
insert into product_images (product_id, url, sort_order) values ('e64518e0-f560-450f-bb87-92c8b383eb4e', '/products/lowell-bra/1.jpg', 0);
insert into product_images (product_id, url, sort_order) values ('e64518e0-f560-450f-bb87-92c8b383eb4e', '/products/lowell-bra/2.jpg', 1);

-- Wolfe Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('0f62da98-815f-49aa-9798-ed4887ead1d9', 'c04ecdac-399c-432c-927c-131602f3da52', 'Wolfe Bra', 'wolfe-bra', '. ✨ Feel Empowered: Experience the confidence that comes from wearing high-performance apparel designed to celebrate your unique fitness journey.


.🧘♀️ Find Your Harmony: Achieve a perfect balance of comfort and motivation, allowing you to focus entirely on the rhythm of your own ambition .


.🚀 Embrace Your Potential: Unleash your drive with gear that supports every bold move, inspiring you to push further than ever before .


.💪 Celebrate Your Vitality: Radiate energy and purpose in activewear that mirrors your dedication to health and vibrant living .', 25, null, 0);
insert into product_images (product_id, url, sort_order) values ('0f62da98-815f-49aa-9798-ed4887ead1d9', '/products/wolfe-bra/1.jpg', 0);
insert into product_images (product_id, url, sort_order) values ('0f62da98-815f-49aa-9798-ed4887ead1d9', '/products/wolfe-bra/2.jpg', 1);
insert into product_images (product_id, url, sort_order) values ('0f62da98-815f-49aa-9798-ed4887ead1d9', '/products/wolfe-bra/3.jpg', 2);
insert into product_images (product_id, url, sort_order) values ('0f62da98-815f-49aa-9798-ed4887ead1d9', '/products/wolfe-bra/4.jpg', 3);

-- Chill Sprint  Shorts
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', '636bf6b7-221c-432b-99c5-fcda41a348dd', 'Chill Sprint  Shorts', 'chill-sprint-shorts', '. ✨Adrenaline rush as these ultra-lightweight shorts move seamlessly with your every stride, igniting your unstoppable spirit.  
. 💪Boost your confidence, they wrap you in comfort and courage, daring you to chase your wildest dreams.  
. ⚡The sleek, bold black design fuels your inner fire, turning every workout into a powerful declaration of strength.  
. 🔥Unleash your true energy, conquer new challenges, and embrace the thrill of pushing beyond what you thought was possible.', 20, null, 0);
insert into product_images (product_id, url, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', '/products/chill-sprint-shorts/1.png', 0);
insert into product_images (product_id, url, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', '/products/chill-sprint-shorts/2.jpg', 1);
insert into product_images (product_id, url, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', '/products/chill-sprint-shorts/3.jpg', 2);
insert into product_images (product_id, url, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', '/products/chill-sprint-shorts/4.jpg', 3);
insert into product_images (product_id, url, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', '/products/chill-sprint-shorts/5.png', 4);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'White', 'S', 20, null, false, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Blue', 'S', 20, null, false, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Beige', 'S', 20, null, false, 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Black', 'S', 20, null, false, 3);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'White', 'M', 20, null, false, 4);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Blue', 'M', 20, null, false, 5);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Beige', 'M', 20, null, false, 6);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Black', 'M', 20, null, false, 7);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'White', 'L', 20, null, false, 8);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Blue', 'L', 20, null, false, 9);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Beige', 'L', 20, null, false, 10);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Black', 'L', 20, null, false, 11);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'White', 'XL', 20, null, false, 12);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Blue', 'XL', 20, null, false, 13);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Beige', 'XL', 20, null, false, 14);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Black', 'XL', 20, null, false, 15);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'White', '2XL', 20, null, false, 16);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Blue', '2XL', 20, null, false, 17);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Beige', '2XL', 20, null, false, 18);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('7bddd985-9590-4c95-8321-2252d21be5c1', 'Black', '2XL', 20, null, false, 19);

-- AeroRush Bra
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', 'c04ecdac-399c-432c-927c-131602f3da52', 'AeroRush Bra', 'flux-bra', '. ✨ Sleek and supportive: A high-performance sports bra designed to elevate your workout with unmatched support and comfort.  
.  🌬️ Breathable innovation: Made from advanced, moisture-wicking fabrics that keep you dry and fresh through every move.  
. 💪 Secure and stylish: Double-strap design with a snug band provides ultimate stability, so you stay confident during every activity.  
. 🌟 Versatile elegance: Perfect for intense training or casual wear, blending function with sophisticated style.', 25, null, 0);
insert into product_images (product_id, url, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', '/products/flux-bra/1.png', 0);
insert into product_images (product_id, url, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', '/products/flux-bra/2.png', 1);
insert into product_images (product_id, url, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', '/products/flux-bra/3.png', 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', 'Black', null, 25, null, false, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', 'Petro Blue', null, 25, null, false, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('c2dd7c4f-14a4-4604-aad4-beaca0badabb', 'Sky Blue', null, 25, null, false, 2);

-- Cloud-Nine Active Shorts
insert into products (id, category_id, name, slug, description, price, compare_at_price, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', '636bf6b7-221c-432b-99c5-fcda41a348dd', 'Cloud-Nine Active Shorts', 'cloud-nine-active-top', '✨ Ultra-Stretchy: Moves with you, never restricts.
🌬️ Max Breathability: Stays airy even during intense sessions.
💧 Sweat-Wicking: Dry-fit technology to keep moisture away.
☁️ Buttery Soft: Feels like a dream against your skin.', 17.5, 25, 0);
insert into product_images (product_id, url, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', '/products/cloud-nine-active-top/1.jpg', 0);
insert into product_images (product_id, url, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', '/products/cloud-nine-active-top/2.jpg', 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Purple', 'S', 17.5, 25, true, 0);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Navy', 'S', 17.5, 25, true, 1);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Purple', 'M', 17.5, 25, true, 2);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Navy', 'M', 17.5, 25, true, 3);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Purple', 'L', 17.5, 25, true, 4);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Navy', 'L', 17.5, 25, true, 5);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Purple', 'XL', 17.5, 25, true, 6);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Navy', 'XL', 17.5, 25, true, 7);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Purple', 'XXL', 17.5, 25, true, 8);
insert into product_variants (product_id, color_label, size_label, price, compare_at_price, available, sort_order) values ('4627ebed-25c2-4c1f-86bf-57ead73a7b32', 'Navy', 'XXL', 17.5, 25, true, 9);

