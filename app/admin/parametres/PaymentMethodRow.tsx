"use client";

import { useState } from "react";
import { updatePaymentMethod, togglePaymentMethodActive, deletePaymentMethod } from "./actions";

type Method = { id: string; label: string; instructions: string; is_active: boolean };

export function PaymentMethodRow({ method }: { method: Method }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(method.label);
  const [instructions, setInstructions] = useState(method.instructions);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await updatePaymentMethod(method.id, formData);
          setEditing(false);
        }}
        className="space-y-2 border-b border-neutral-100 py-3"
      >
        <input
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full max-w-sm border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <input
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions shown at checkout"
          className="w-full max-w-sm border border-neutral-300 px-2 py-1.5 text-sm"
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
    <div className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm">
      <div>
        <p>{method.label}</p>
        {method.instructions && <p className="text-xs text-neutral-500">{method.instructions}</p>}
      </div>
      <div className="flex items-center gap-4">
        <form action={togglePaymentMethodActive.bind(null, method.id, !method.is_active)}>
          <button className={method.is_active ? "text-emerald-700" : "text-neutral-400"}>
            {method.is_active ? "Active" : "Inactive"}
          </button>
        </form>
        <button className="text-neutral-600 hover:text-brand-navy" onClick={() => setEditing(true)}>
          Edit
        </button>
        <form action={deletePaymentMethod.bind(null, method.id)}>
          <button className="text-neutral-600 hover:text-red-600">Delete</button>
        </form>
      </div>
    </div>
  );
}
