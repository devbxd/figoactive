// Site-wide constants — no dashboard for this site, so these are edited
// directly in code and redeployed rather than through an admin UI.

// NEXT_PUBLIC_SITE_URL must be a full URL with a scheme (https://...) — a
// bare domain (e.g. "figoactive.netlify.app") makes `new URL()` throw
// wherever this is used (layout.tsx's metadataBase, sitemap.ts, ...),
// which crashes every single page. Fall back instead of trusting it blind.
function resolveSiteUrl(raw: string | undefined) {
  if (!raw) return "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    try {
      return new URL(`https://${raw}`).toString().replace(/\/$/, "");
    } catch {
      return "http://localhost:3000";
    }
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const BRAND_NAME = "Figo Active";

// Homepage countdown banner — update the date whenever a new promo starts,
// or the banner just disappears once it passes.
export const SALE_LABEL = "End of season sale — up to 30% off";
export const SALE_ENDS_AT = "2026-08-31T23:59:59+03:00";

// Confirmed with the client.
export const WHATSAPP_NUMBER = "96176963942";
export const INSTAGRAM_HANDLE = "figoactive";

// Placeholder — no public contact email found on figoactive.com or their
// Instagram; set the real one here (and configure it as a verified sender
// in Resend) once the client provides it.
export const CONTACT_EMAIL = "hello@figoactive.com";

// Lebanon shipping, same split as houseofoptics — confirm actual rates
// with the client before launch.
export const SHIPPING_COST = { beirut: 4, outside_beirut: 6 } as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
