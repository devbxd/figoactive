// Site-wide constants — no dashboard for this site, so these are edited
// directly in code and redeployed rather than through an admin UI.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const BRAND_NAME = "Figo Active";

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
