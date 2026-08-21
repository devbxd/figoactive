import { Accordion } from "@/components/Accordion";
import { whatsappLink } from "@/lib/site";
import { getFaqItems } from "@/lib/settings";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await getFaqItems();

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
        {faqs.map((item) => (
          <Accordion key={item.id} title={item.question}>
            <p className="whitespace-pre-line">{item.answer}</p>
          </Accordion>
        ))}
      </div>
    </main>
  );
}
