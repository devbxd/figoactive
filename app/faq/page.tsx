import { Accordion } from "@/components/Accordion";
import { SHIPPING_COST, whatsappLink } from "@/lib/site";

export const metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add items to your cart, go to checkout and fill in your details. Orders are confirmed by WhatsApp and paid on delivery — no card needed.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery only, for now. You pay when your order arrives.",
  },
  {
    q: "How much is shipping?",
    a: `$${SHIPPING_COST.beirut} within Beirut, $${SHIPPING_COST.outside_beirut} outside Beirut.`,
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 1-3 business days depending on your area. We'll confirm a delivery window with you on WhatsApp after you order.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes — returns and exchanges are accepted within 7 days if the item hasn't been worn and is in its original packaging. Message us on WhatsApp to start a return.",
  },
  {
    q: "How do I know my size?",
    a: "Each product page with size options has a size guide chart under the product description. Still unsure? Message us on WhatsApp with your measurements and we'll help you pick.",
  },
  {
    q: "Do you restock sold-out items?",
    a: "Restocks happen regularly. Follow @figoactive on Instagram or sign up to our newsletter to hear about new drops and restocks first.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="text-center font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">
        Frequently asked questions
      </h1>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Can&apos;t find what you&apos;re looking for?{" "}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-navy">
          Message us on WhatsApp
        </a>
        .
      </p>

      <div className="mt-10 border-t border-neutral-200">
        {FAQS.map((item) => (
          <Accordion key={item.q} title={item.q}>
            <p>{item.a}</p>
          </Accordion>
        ))}
      </div>
    </main>
  );
}
