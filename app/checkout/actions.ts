"use server";

// No database on this site — an order is never stored anywhere. This just
// emails the owner (if Resend is configured) and hands back a reference
// number for the confirmation screen / WhatsApp message. If the owner needs
// a real order record, they need the WhatsApp message the customer sends
// from the confirmation screen, or the email below.

type CheckoutInput = {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "cod";
  shippingZone: "beirut" | "outside_beirut";
  shippingCost: number;
  items: { variant: string | null; name: string; price: number; quantity: number }[];
};

export async function submitOrder(input: CheckoutInput) {
  if (!input.name || !input.phone || !input.address || input.items.length === 0) {
    throw new Error("Missing required checkout fields");
  }

  const itemsTotal = input.items.reduce((a, i) => a + i.price * i.quantity, 0);
  const total = itemsTotal + input.shippingCost;
  const orderId = crypto.randomUUID();

  try {
    const { notifyNewOrder } = await import("@/lib/notify-order");
    await notifyNewOrder({ orderId, ...input, total });
  } catch {
    // notification failure must never block the customer's order from succeeding
  }

  return { orderId, total };
}
