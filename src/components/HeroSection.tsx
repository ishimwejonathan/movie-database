import React from "react";

type HeroItem = {
  title: string;
  year?: string;
  poster: string;   // full-bleed image
  badge?: string;   // e.g. "#1 in series 🔥"
  rating?: string;  // e.g. "4.2"
  onClick?: () => void;
};

type Props = {
  left: HeroItem;   // big tile
  right: HeroItem;  // tall tile
};

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
    {children}
  </span>
);

export default function HeroSection({ left, right }: Props) {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Left: big hero (2 cols) */}
      <button
        onClick={left.onClick}
        className="group relative overflow-hidden rounded-3xl md:col-span-2"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={left.poster}
          alt={left.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="eager"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        {/* top-left badge */}
        {left.badge && (
          <div className="absolute left-4 top-4">
            <Pill>{left.badge}</Pill>
          </div>
        )}
        {/* bottom-left text */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white drop-shadow-sm md:text-2xl">
              {left.title}
            </h3>
            {left.year && (
              <p className="mt-0.5 text-sm text-white/80">{left.year}</p>
            )}
          </div>
          {/* subtle play chevron */}
          <div className="mr-1 hidden rounded-full bg-white/15 p-3 text-white backdrop-blur group-hover:bg-white/25 md:block">
            ▶
          </div>
        </div>
      </button>

      {/* Right: featured tall card */}
      <button
        onClick={right.onClick}
        className="group relative overflow-hidden rounded-3xl"
        style={{ aspectRatio: "4/5" }}
      >
        <img
          src={right.poster}
          alt={right.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        {/* rating pill */}
        {right.rating && (
          <div className="absolute left-3 top-3">
            <Pill>★ {right.rating}</Pill>
          </div>
        )}
        {/* bottom-left text */}
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-lg font-semibold text-white">{right.title}</h4>
          {right.year && (
            <p className="text-xs text-white/80 leading-5">{right.year}</p>
          )}
        </div>
      </button>
    </section>
  );
}
