import React from "react";

export type ContinueItem = {
  title: string;
  year?: string;
  poster: string;
  onClick?: () => void;
};

type Props = {
  remainingLabel?: string; // e.g. "3 Movies Remaining"
  items: ContinueItem[];
  onSeeMore?: () => void;
};

export default function ContinueWatching({
  remainingLabel,
  items,
  onSeeMore,
}: Props) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-semibold text-white">Continue watching</h2>
          {remainingLabel && (
            <span className="text-sm text-white/60">({remainingLabel})</span>
          )}
        </div>
        <button
          onClick={onSeeMore}
          className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
        >
          see more
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((m) => (
          <button
            key={m.title + m.year}
            onClick={m.onClick}
            className="group relative overflow-hidden rounded-3xl"
            style={{ aspectRatio: "16/10" }}
            aria-label={`Open ${m.title}`}
          >
            <img
              src={m.poster}
              alt={m.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
              <div>
                <p className="max-w-[80%] truncate text-sm font-semibold text-white drop-shadow">
                  {m.title}
                </p>
                {m.year && (
                  <p className="text-[11px] text-white/75">{m.year}</p>
                )}
              </div>
              <span className="hidden rounded-full border border-white/40 px-2 py-1 text-[10px] text-white/90 group-hover:bg-white/15 md:block">
                ▶
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
