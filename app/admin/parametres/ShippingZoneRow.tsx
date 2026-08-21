"use client";

import { useState } from "react";
import { updateShippingZone, toggleShippingZoneActive, deleteShippingZone } from "./actions";

type Zone = { id: string; label: string; cost: number; is_active: boolean };

export function ShippingZoneRow({ zone }: { zone: Zone }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(zone.label);
  const [cost, setCost] = useState(String(zone.cost));

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await updateShippingZone(zone.id, formData);
          setEditing(false);
        }}
        className="flex flex-wrap items-center gap-2 border-b border-neutral-100 py-3"
      >
        <input
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-40 border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <input
          name="cost"
          type="number"
          step="0.01"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-24 border border-neutral-300 px-2 py-1.5 text-sm"
        />
        <button type="submit" className="text-sm text-brand-navy">
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-sm text-neutral-500">
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm">
      <p>
        {zone.label} — ${Number(zone.cost).toFixed(2)}
      </p>
      <div className="flex items-center gap-4">
        <form action={toggleShippingZoneActive.bind(null, zone.id, !zone.is_active)}>
          <button className={zone.is_active ? "text-emerald-700" : "text-neutral-400"}>
            {zone.is_active ? "Active" : "Inactive"}
          </button>
        </form>
        <button className="text-neutral-600 hover:text-brand-navy" onClick={() => setEditing(true)}>
          Edit
        </button>
        <form action={deleteShippingZone.bind(null, zone.id)}>
          <button className="text-neutral-600 hover:text-red-600">Delete</button>
        </form>
      </div>
    </div>
  );
}
