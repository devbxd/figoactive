// Emails sent by Resend when a new order comes in — this site has no
// dashboard/database, so this (plus the customer's own "send via WhatsApp
// too" tap on the confirmation screen, see app/checkout/page.tsx) is the
// only way an order reaches the shop owner. Requires RESEND_API_KEY and
// OWNER_NOTIFICATION_EMAIL (see .env.example); if not configured, this
// silently no-ops — checkout must never fail because a notification
// couldn't be sent.

import { renderEmail } from "./email-template";
import { BRAND_NAME, SITE_URL } from "./site";

type OrderNotification = {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  shippingZone: string;
  total: number;
  items: { name: string; variant: string | null; price: number; quantity: number }[];
};

const FROM = `${BRAND_NAME} <orders@figoactive.com>`;

async function sendEmail(apiKey: string, to: string, subject: string, html: string) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) {
      console.error(`Resend email to ${to} failed (${res.status}): ${await res.text()}`);
    }
  } catch (err) {
    console.error(`Resend email to ${to} threw:`, err);
  }
}

function itemsList(items: OrderNotification["items"]) {
  const rows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 0;border-bottom:1px solid #f0f0f0;">${i.quantity} × ${i.name}${i.variant ? ` (${i.variant})` : ""}</td>
          <td style="padding:6px 0;border-bottom:1px solid #f0f0f0;text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:16px 0;">${rows}</table>`;
}

export async function notifyNewOrder(order: OrderNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  if (!apiKey || !ownerEmail) return;

  await sendEmail(
    apiKey,
    ownerEmail,
    `New order — $${order.total.toFixed(2)}`,
    renderEmail({
      heading: "New order received",
      bodyHtml: `
        <p style="margin:0 0 4px;"><strong>${order.name}</strong> — ${order.phone}</p>
        <p style="margin:0 0 4px;">${order.address}, ${order.city} (${order.shippingZone})</p>
        ${itemsList(order.items)}
        <p style="margin:0;font-size:16px;"><strong>Total: $${order.total.toFixed(2)}</strong></p>
        <p style="margin:8px 0 0;font-size:12px;color:#999;">Order ref: ${order.orderId.slice(0, 8)}</p>
      `,
      ctaLabel: "Visit site",
      ctaUrl: SITE_URL,
    })
  );
}
