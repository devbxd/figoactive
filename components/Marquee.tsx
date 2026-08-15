export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-brand-black py-3">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            {item}
            <span className="text-brand-mint">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
