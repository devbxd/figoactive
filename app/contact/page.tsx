import { CONTACT_EMAIL, INSTAGRAM_HANDLE, whatsappLink } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center md:px-6">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-brand-navy">Contact us</h1>
      <p className="mt-2 text-sm text-neutral-600">A question about a product? We reply quickly.</p>

      <div className="mt-8 space-y-3">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-neutral-300 px-4 py-3 font-heading text-sm uppercase tracking-wide hover:border-brand-navy"
        >
          WhatsApp
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="block border border-neutral-300 px-4 py-3 font-heading text-sm uppercase tracking-wide hover:border-brand-navy"
        >
          {CONTACT_EMAIL}
        </a>
        <a
          href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-neutral-300 px-4 py-3 font-heading text-sm uppercase tracking-wide hover:border-brand-navy"
        >
          @{INSTAGRAM_HANDLE}
        </a>
      </div>
    </main>
  );
}
