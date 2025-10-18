import { useEffect, useRef, useState } from "react";

type OmdbMovie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

type Props = {
  apiKey: string;
  onPick?: (movie: OmdbMovie) => void; // e.g., open details
  title?: string;
  seedIds?: string[];                   // override curated list if you like
};

// Popular IMDb IDs (stable picks)
const DEFAULT_SEED_IDS = [
  "tt1375666", // Inception
  "tt0816692", // Interstellar
  "tt0468569", // The Dark Knight
  "tt4154796", // Avengers: Endgame
  "tt7286456", // Joker
  "tt6751668", // Parasite
  "tt1160419", // Dune (2021)
  "tt0068646", // The Godfather
  "tt0109830", // Forrest Gump
  "tt0120737", // LOTR: Fellowship
];

export default function PreviewGallery({
  apiKey,
  onPick,
  title = "Featured picks",
  seedIds = DEFAULT_SEED_IDS,
}: Props) {
  const [items, setItems] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setLoading(false);
      setError("Missing OMDb API key.");
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const urlFor = (id: string) => {
          const u = new URL("https://www.omdbapi.com/");
          u.searchParams.set("apikey", apiKey);
          u.searchParams.set("i", id);
          u.searchParams.set("plot", "short");
          return u.toString();
        };

        const tasks = seedIds.slice(0, 12).map(async (id) => {
          const res = await fetch(urlFor(id), { signal: controller.signal });
          const data = await res.json();
          if (data && data.Response !== "False") {
            const m: OmdbMovie = {
              Title: data.Title,
              Year: data.Year,
              imdbID: data.imdbID,
              Type: data.Type,
              Poster: data.Poster,
            };
            return m;
          }
          return null;
        });

        const settled = await Promise.allSettled(tasks);
        const ok = settled
          .map((r) => (r.status === "fulfilled" ? r.value : null))
          .filter(Boolean) as OmdbMovie[];

        setItems(ok);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError("Failed to load featured picks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [apiKey, seedIds.join(",")]);

  const Skeleton = () => (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="h-48 w-full animate-pulse bg-white/10" />
      <div className="p-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {/* place for “See more” later if you want */}
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {loading &&
          Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)}

        {!loading &&
          items.map((m) => (
            <button
              key={m.imdbID}
              onClick={() => onPick?.(m)}
              className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-white/20"
              style={{ aspectRatio: "2/3" }}
              title={`Open ${m.Title}`}
            >
              <img
                src={
                  m.Poster && m.Poster !== "N/A"
                    ? m.Poster
                    : `https://via.placeholder.com/400x600?text=${encodeURIComponent(
                        m.Title
                      )}`
                }
                alt={m.Title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <p className="line-clamp-2 text-sm font-semibold">{m.Title}</p>
                <p className="text-[11px] text-white/75">{m.Year}</p>
              </div>
            </button>
          ))}
      </div>
    </section>
  );
}
