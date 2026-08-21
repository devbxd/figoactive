"use client";

import { useState } from "react";
import { submitReview } from "@/app/shop/[slug]/actions";

type Review = { id: string; customerName: string; rating: number; comment: string; createdAt: string };

function Stars({ value }: { value: number }) {
  return (
    <span className="text-brand-mint" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(value)}
      <span className="text-neutral-300">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export function ProductReviews({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const average = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(formData: FormData) {
    await submitReview(productId, formData);
    setSubmitted(true);
  }

  return (
    <div>
      {reviews.length > 0 && (
        <p className="mb-4 flex items-center gap-2 text-sm">
          <Stars value={Math.round(average)} />
          <span className="text-neutral-600">
            {average.toFixed(1)} out of 5 ({reviews.length} review{reviews.length === 1 ? "" : "s"})
          </span>
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-neutral-100 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{r.customerName}</p>
              <Stars value={r.rating} />
            </div>
            {r.comment && <p className="mt-1 text-sm text-neutral-600">{r.comment}</p>}
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-neutral-500">No reviews yet — be the first.</p>}
      </div>

      {submitted ? (
        <p className="mt-4 text-sm text-emerald-700">Thanks! Your review will show up once it's approved.</p>
      ) : (
        <form action={handleSubmit} className="mt-6 space-y-3 border-t border-neutral-200 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">Write a review</p>
          <input
            name="customer_name"
            required
            placeholder="Your name"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                className={`text-2xl leading-none ${n <= rating ? "text-brand-mint" : "text-neutral-300"}`}
              >
                ★
              </button>
            ))}
            <input type="hidden" name="rating" value={rating} />
          </div>
          <textarea
            name="comment"
            rows={3}
            placeholder="How was it? (optional)"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none"
          />
          <button
            type="submit"
            className="bg-brand-navy px-5 py-2 font-heading text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
          >
            Submit review
          </button>
        </form>
      )}
    </div>
  );
}
