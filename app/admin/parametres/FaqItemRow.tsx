"use client";

import { useState } from "react";
import { updateFaqItem, deleteFaqItem } from "./actions";

type Item = { id: string; question: string; answer: string };

export function FaqItemRow({ item }: { item: Item }) {
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(item.question);
  const [answer, setAnswer] = useState(item.answer);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await updateFaqItem(item.id, formData);
          setEditing(false);
        }}
        className="space-y-2 border-b border-neutral-100 py-3"
      >
        <input
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <textarea
          name="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          className="w-full border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <div className="flex gap-3">
          <button type="submit" className="text-sm text-brand-navy">
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)} className="text-sm text-neutral-500">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 border-b border-neutral-100 py-3 text-sm">
      <div className="min-w-0">
        <p className="font-medium">{item.question}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{item.answer}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <button className="text-neutral-600 hover:text-brand-navy" onClick={() => setEditing(true)}>
          Edit
        </button>
        <form action={deleteFaqItem.bind(null, item.id)}>
          <button className="text-neutral-600 hover:text-red-600">Delete</button>
        </form>
      </div>
    </div>
  );
}
