"use client";

import { useEffect, useState } from "react";

function timeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownBanner({ label, endsAt }: { label: string; endsAt?: string | null }) {
  const target = endsAt ? new Date(endsAt).getTime() : null;
  const [t, setT] = useState(() => (target ? timeLeft(target) : null));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setT(timeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t?.done) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-brand-mint px-4 py-2.5 text-center text-brand-navy">
      <span className="font-heading text-xs font-semibold uppercase tracking-widest">{label}</span>
      {t && (
        <div className="flex items-center gap-1.5 font-heading text-sm font-bold tabular-nums">
          {[
            { v: t.days, l: "D" },
            { v: t.hours, l: "H" },
            { v: t.minutes, l: "M" },
            { v: t.seconds, l: "S" },
          ].map((u, i) => (
            <span key={u.l} className="flex items-center gap-1.5">
              <span className="rounded bg-brand-navy px-1.5 py-0.5 text-white">{pad(u.v)}</span>
              <span className="text-[10px]">{u.l}</span>
              {i < 3 && <span className="text-brand-navy/40">:</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
