"use client";

import { useState } from "react";
import { renameCategory, deleteCategory } from "./actions";

type Category = { id: string; name: string; slug: string };

export function CategoryRow({ category, productCount }: { category: Category; productCount: number }) {
  const [name, setName] = useState(category.name);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-100 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-neutral-300 px-2 py-1.5 text-sm sm:w-56"
          />
        ) : (
          <p className="truncate text-sm font-medium">{category.name}</p>
        )}
        <p className="mt-0.5 text-xs text-neutral-500">
          {category.slug} · {productCount} product{productCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-sm">
        {editing ? (
          <button
            className="text-brand-navy"
            onClick={async () => {
              await renameCategory(category.id, name);
              setEditing(false);
            }}
          >
            Save
          </button>
        ) : (
          <button className="text-neutral-600 hover:text-brand-navy" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        <button
          disabled={deleting}
          className="text-neutral-600 hover:text-red-600 disabled:opacity-50"
          onClick={async () => {
            if (!confirm(`Delete "${category.name}"? Products in it will remain but without a category.`)) return;
            setDeleting(true);
            await deleteCategory(category.id);
          }}
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
