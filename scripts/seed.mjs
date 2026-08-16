// One-time seed script: migrates the current hardcoded catalog into
// Supabase (categories, products, images, variants) and creates the
// admin login user. Run once after applying supabase/migrations/0001_init.sql,
// with ADMIN_EMAIL and ADMIN_PASSWORD set in .env.local (never committed —
// this file must never contain the real credentials in plain text):
//   node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const PRODUCTS = [
  { slug: "dolmation-set", name: "Dolmation Set", category: "Sets", description: "", price: 50, compareAtPrice: 65, images: ["/products/dolmation-set/1.jpg"], variants: [] },
  { slug: "pull-puff-set", name: "Pull-Puff Set", category: "Sets", description: "", price: 50, compareAtPrice: 65, images: ["/products/pull-puff-set/1.png", "/products/pull-puff-set/2.png"], variants: [] },
  { slug: "the-airflow-bra", name: "The Airflow Bra", category: "Sports Bras", description: "", price: 17.5, compareAtPrice: 25, images: ["/products/the-airflow-bra/1.png", "/products/the-airflow-bra/2.png", "/products/the-airflow-bra/3.png"], variants: [] },
  { slug: "aura-bra", name: "Aura Bra", category: "Sports Bras", description: "", price: 17.5, compareAtPrice: 25, images: ["/products/aura-bra/1.jpg", "/products/aura-bra/2.jpg"], variants: [] },
  { slug: "lili-biker-shorts", name: "Lili Biker Shorts", category: "Shorts", description: "", price: 15, compareAtPrice: null, images: ["/products/lili-biker-shorts/1.png"], variants: [] },
  { slug: "athletica-bra", name: "Athletica Bra", category: "Sports Bras", description: "", price: 17.5, compareAtPrice: 25, images: ["/products/athletica-bra/1.png", "/products/athletica-bra/2.png"], variants: [] },
  { slug: "bouba-flare-pants", name: "Bouba Flare Pants", category: "Leggings & Pants", description: "", price: 20, compareAtPrice: 27, images: ["/products/bouba-flare-pants/1.png"], variants: [{ color: "Black", size: null, price: 20, compareAtPrice: 27, available: true }] },
  { slug: "kintex-bra", name: "Kintex Bra", category: "Sports Bras", description: "🕊️ Peace – Find your calm in the chaos. Solace is your sanctuary, offering gentle support and a soothing fit that brings stillness to your busiest days.\n🌊 Balance – Life is about harmony. Solace is crafted to align comfort and support perfectly, helping you stay centered no matter what the day brings.\n🌙 Restoration – Rest is power. Honor your body's need to recover, wrapping you in softness that helps you recharge and come back stronger.\n💫 Resilience – Even on the hardest days, you rise. A reminder that you are capable of bouncing back, standing tall, and beginning again.", price: 17.5, compareAtPrice: 25, images: ["/products/kintex-bra/1.jpg", "/products/kintex-bra/2.jpg"], variants: [
    { color: "Black", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Citron", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Citron", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Citron", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Citron", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Citron", size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
  ] },
  { slug: "solace-bra", name: "Solace Bra", category: "Sports Bras", description: "🕊️ Peace – Find your calm in the chaos. Solace is your sanctuary, offering gentle support and a soothing fit that brings stillness to your busiest days.\n🌊 Balance – Life is about harmony. Solace is crafted to align comfort and support perfectly, helping you stay centered no matter what the day brings.\n🌙 Restoration – Rest is power. Solace honors your body's need to recover, wrapping you in softness that helps you recharge and come back stronger.\n💫 Resilience – Even on the hardest days, you rise. Solace is a reminder that you are capable of bouncing back, standing tall, and beginning again.", price: 17.5, compareAtPrice: 25, images: ["/products/solace-bra/1.jpg"], variants: [
    { color: null, size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: null, size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: null, size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: null, size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: null, size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
  ] },
  { slug: "velour-bra", name: "Velour Bra", category: "Sports Bras", description: "🛡️ Protection – Velour wraps you in a layer of luxurious softness that shields your skin from irritation, keeping you comfortable through every rep and stretch.\n❤️ Self-Love – Because you deserve to treat yourself. Velour reminds you that caring for your body is the most powerful thing a woman can do.\n🌸 Grace – Move with elegance and ease. Velour's plush fabric flows with your body, making every movement feel effortlessly beautiful.\n✨ Endurance – Soft on the outside, strong on the inside. Velour is built to last through long days, tough sessions, and everything in between.", price: 17.5, compareAtPrice: 25, images: ["/products/velour-bra/1.png"], variants: [
    { color: "Black", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
  ] },
  { slug: "lumiere-bra", name: "Lumière Bra", category: "Sports Bras", description: "💪 Strength – Built to empower every move you make, Lumière gives you the support to lift higher, push harder, and shine brighter in every workout.\n🔥 Motivation – When you wear Lumière, you ignite a fire within. Designed for women who refuse to slow down and always chase their best self.\n🌟 Confidence – Feel radiant from the inside out. Lumière's sleek, seamless design makes you stand tall and own every room you walk into.\n🦋 Freedom – Lightweight and barely-there, Lumière lets your body move without limits — because true freedom starts with how you feel.", price: 17.5, compareAtPrice: 25, images: ["/products/lumiere-bra/1.png", "/products/lumiere-bra/2.png", "/products/lumiere-bra/3.png"], variants: [
    { color: "Black", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "White", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Sweet rose", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Black", size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "White", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "White", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "White", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "White", size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Sweet rose", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Sweet rose", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Sweet rose", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Sweet rose", size: "2XL", price: 17.5, compareAtPrice: 25, available: true },
  ] },
  { slug: "kai-bra", name: "Kai Bra", category: "Sports Bras", description: ". ⚡Ignite Your Potential : Unlock explosive energy and high-intensity performance with apparel built to handle your fastest, most powerful movements.\n\n\n. 🌊Command Your Flow : Experience the seamless, fluid support of gear that adapts to your body, keeping you centered throughout every complex workout.\n\n\n. 🏆Master the Discipline: Elevate your standard with premium designs that honor the dedication, consistency, and excellence you bring to your training.\n\n\n. 🏔️Unlock Your Peak : Reach new heights of personal achievement with resilient, top-tier performance wear that supports you at every stage of the journey.", price: 25, compareAtPrice: null, images: ["/products/kai-bra/1.jpg", "/products/kai-bra/2.jpg"], variants: [] },
  { slug: "lowell-bra", name: "Lowell Bra", category: "Sports Bras", description: ". 🏃Advanced Moisture-Wicking Fabric: Stay cool and dry throughout your toughest sessions with high-performance, breathable materials.\n\n\n  . 💪Precision Ergonomic Support: Experience an optimized, secure fit that moves naturally with your body during high-intensity training.\n\n\n . 🎯Strategic Ventilation Zones: Benefit from integrated mesh detailing designed for enhanced airflow and comfort during peak activity.\n\n\n . 🏋️Minimalist Modern Aesthetic: Elevate your workout wardrobe with clean lines and a refined silhouette that bridges function and contemporary style.", price: 25, compareAtPrice: null, images: ["/products/lowell-bra/1.jpg", "/products/lowell-bra/2.jpg"], variants: [] },
  { slug: "wolfe-bra", name: "Wolfe Bra", category: "Sports Bras", description: ". ✨ Feel Empowered: Experience the confidence that comes from wearing high-performance apparel designed to celebrate your unique fitness journey.\n\n\n.🧘‍♀️ Find Your Harmony: Achieve a perfect balance of comfort and motivation, allowing you to focus entirely on the rhythm of your own ambition .\n\n\n.🚀 Embrace Your Potential: Unleash your drive with gear that supports every bold move, inspiring you to push further than ever before .\n\n\n.💪 Celebrate Your Vitality: Radiate energy and purpose in activewear that mirrors your dedication to health and vibrant living .", price: 25, compareAtPrice: null, images: ["/products/wolfe-bra/1.jpg", "/products/wolfe-bra/2.jpg", "/products/wolfe-bra/3.jpg", "/products/wolfe-bra/4.jpg"], variants: [] },
  { slug: "chill-sprint-shorts", name: "Chill Sprint  Shorts", category: "Shorts", description: ". ✨Adrenaline rush as these ultra-lightweight shorts move seamlessly with your every stride, igniting your unstoppable spirit.  \n. 💪Boost your confidence, they wrap you in comfort and courage, daring you to chase your wildest dreams.  \n. ⚡The sleek, bold black design fuels your inner fire, turning every workout into a powerful declaration of strength.  \n. 🔥Unleash your true energy, conquer new challenges, and embrace the thrill of pushing beyond what you thought was possible.", price: 20, compareAtPrice: null, images: ["/products/chill-sprint-shorts/1.png", "/products/chill-sprint-shorts/2.jpg", "/products/chill-sprint-shorts/3.jpg", "/products/chill-sprint-shorts/4.jpg", "/products/chill-sprint-shorts/5.png"], variants: [
    { color: "White", size: "S", price: 20, compareAtPrice: null, available: false },
    { color: "Blue", size: "S", price: 20, compareAtPrice: null, available: false },
    { color: "Beige", size: "S", price: 20, compareAtPrice: null, available: false },
    { color: "Black", size: "S", price: 20, compareAtPrice: null, available: false },
    { color: "White", size: "M", price: 20, compareAtPrice: null, available: false },
    { color: "Blue", size: "M", price: 20, compareAtPrice: null, available: false },
    { color: "Beige", size: "M", price: 20, compareAtPrice: null, available: false },
    { color: "Black", size: "M", price: 20, compareAtPrice: null, available: false },
    { color: "White", size: "L", price: 20, compareAtPrice: null, available: false },
    { color: "Blue", size: "L", price: 20, compareAtPrice: null, available: false },
    { color: "Beige", size: "L", price: 20, compareAtPrice: null, available: false },
    { color: "Black", size: "L", price: 20, compareAtPrice: null, available: false },
    { color: "White", size: "XL", price: 20, compareAtPrice: null, available: false },
    { color: "Blue", size: "XL", price: 20, compareAtPrice: null, available: false },
    { color: "Beige", size: "XL", price: 20, compareAtPrice: null, available: false },
    { color: "Black", size: "XL", price: 20, compareAtPrice: null, available: false },
    { color: "White", size: "2XL", price: 20, compareAtPrice: null, available: false },
    { color: "Blue", size: "2XL", price: 20, compareAtPrice: null, available: false },
    { color: "Beige", size: "2XL", price: 20, compareAtPrice: null, available: false },
    { color: "Black", size: "2XL", price: 20, compareAtPrice: null, available: false },
  ] },
  { slug: "flux-bra", name: "AeroRush Bra", category: "Sports Bras", description: ". ✨ Sleek and supportive: A high-performance sports bra designed to elevate your workout with unmatched support and comfort.  \n.  🌬️ Breathable innovation: Made from advanced, moisture-wicking fabrics that keep you dry and fresh through every move.  \n. 💪 Secure and stylish: Double-strap design with a snug band provides ultimate stability, so you stay confident during every activity.  \n. 🌟 Versatile elegance: Perfect for intense training or casual wear, blending function with sophisticated style.", price: 25, compareAtPrice: null, images: ["/products/flux-bra/1.png", "/products/flux-bra/2.png", "/products/flux-bra/3.png"], variants: [
    { color: "Black", size: null, price: 25, compareAtPrice: null, available: false },
    { color: "Petro Blue", size: null, price: 25, compareAtPrice: null, available: false },
    { color: "Sky Blue", size: null, price: 25, compareAtPrice: null, available: false },
  ] },
  { slug: "cloud-nine-active-top", name: "Cloud-Nine Active Shorts", category: "Shorts", description: "✨ Ultra-Stretchy: Moves with you, never restricts.\n🌬️ Max Breathability: Stays airy even during intense sessions.\n💧 Sweat-Wicking: Dry-fit technology to keep moisture away.\n☁️ Buttery Soft: Feels like a dream against your skin.", price: 17.5, compareAtPrice: 25, images: ["/products/cloud-nine-active-top/1.jpg", "/products/cloud-nine-active-top/2.jpg"], variants: [
    { color: "Purple", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Navy", size: "S", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Purple", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Navy", size: "M", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Purple", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Navy", size: "L", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Purple", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Navy", size: "XL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Purple", size: "XXL", price: 17.5, compareAtPrice: 25, available: true },
    { color: "Navy", size: "XXL", price: 17.5, compareAtPrice: 25, available: true },
  ] },
];

function slugify(input) {
  return input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

async function main() {
  const categoryNames = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  const categoryIds = {};

  for (const [i, name] of categoryNames.entries()) {
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug: slugify(name), sort_order: i })
      .select("id")
      .single();
    if (error) throw error;
    categoryIds[name] = data.id;
    console.log(`category: ${name}`);
  }

  for (const [i, p] of PRODUCTS.entries()) {
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        category_id: categoryIds[p.category],
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compare_at_price: p.compareAtPrice,
        sort_order: i,
      })
      .select("id")
      .single();
    if (error) throw error;

    if (p.images.length > 0) {
      const { error: imgErr } = await supabase
        .from("product_images")
        .insert(p.images.map((url, idx) => ({ product_id: product.id, url, sort_order: idx })));
      if (imgErr) throw imgErr;
    }

    if (p.variants.length > 0) {
      const { error: varErr } = await supabase.from("product_variants").insert(
        p.variants.map((v, idx) => ({
          product_id: product.id,
          color_label: v.color,
          size_label: v.size,
          price: v.price,
          compare_at_price: v.compareAtPrice,
          available: v.available,
          sort_order: idx,
        }))
      );
      if (varErr) throw varErr;
    }

    console.log(`product: ${p.name}`);
  }

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const alreadyExists = existingUsers?.users?.some((u) => u.email === ADMIN_EMAIL);
  if (!alreadyExists) {
    const { error: userErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (userErr) throw userErr;
    console.log(`admin user created: ${ADMIN_EMAIL}`);
  } else {
    console.log(`admin user already exists: ${ADMIN_EMAIL}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
