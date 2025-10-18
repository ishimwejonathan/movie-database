import { useEffect, useRef, useState } from "react";
import ContinueWatching from "../components/ContinueWatching"; // optional, keep if you have it
import HeroSection from "../components/HeroSection";           // optional, keep if you have it
import MovieCard from "../components/MovieCard";
import MovieDetails from "../components/MovieDetails";

const API_KEY = "a55e5ca"; // ✅ your OMDb API key

// ---- Types (OMDb) ----
type OmdbSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode" | string;
  Poster: string;
};

type OmdbSearchResponse =
  | {
      Response: "True";
      Search: OmdbSearchItem[];
      totalResults: string;
    }
  | {
      Response: "False";
      Error: string;
    };

// ---- Home ----
export default function Home() {
  const [movies, setMovies] = useState<OmdbSearchItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<OmdbSearchItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // search state
  const [query, setQuery] = useState<string>("");
  const [year, setYear] = useState<string>(""); // optional year filter
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  // Abort in-flight requests when a new search fires or component unmounts
  const abortRef = useRef<AbortController | null>(null);

  const makeUrl = (q: string, p = 1, y?: string) => {
    const url = new URL("https://www.omdbapi.com/");
    url.searchParams.set("apikey", API_KEY);
    url.searchParams.set("s", q.trim());
    url.searchParams.set("type", "movie");
    url.searchParams.set("page", String(p));
    if (y && /^\d{4}$/.test(y)) url.searchParams.set("y", y);
    return url.toString();
  };

  const fetchMovies = async (q: string, p = 1, y?: string) => {
    if (!q || q.trim().length === 0) {
      setMovies([]);
      setTotalResults(0);
      setError("");
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(makeUrl(q, p, y), { signal: controller.signal });
      const data: OmdbSearchResponse = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
        setTotalResults(Number(data.totalResults || 0));
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || "No movies found. Try another search.");
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setMovies([]);
      setTotalResults(0);
      setError("Failed to fetch data. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q: string, y?: string) => {
    setQuery(q);
    if (typeof y === "string") setYear(y);
    setPage(1);
    fetchMovies(q, 1, y ?? year);
  };

  useEffect(() => {
    if (!query) return;
    fetchMovies(query, page, year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(totalResults / 10));

  // Simple skeleton
  const Skeleton = () => (
    <div className="h-72 md:h-80 w-full rounded-2xl bg-white/10 animate-pulse" />
  );

  // --- Inline, redesigned search bar (no react-icons needed) ---
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) handleSearch(query, year);
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Title + Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">Discover your favourites.</h1>

          {/* Attractive, glassy search bar block */}
          <form
            onSubmit={onSubmit}
            className="relative flex w-full max-w-xl items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-lg transition-all duration-300 hover:border-amber-400/60 hover:bg-white/15 focus-within:border-amber-400/80"
          >
            {/* Left icon substitute (emoji) */}
            <span className="absolute left-4 text-white/70 text-lg"></span>

            {/* Query */}
            <input
              type="text"
              placeholder="Search your favourite movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-28 text-sm text-white placeholder:text-white/60 focus:outline-none margin:left-50"
            />

            {/* Year pill */}
            <input
              value={year}
              onChange={(e) =>
                setYear(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
              }
              placeholder="Year"
              className="mr-[88px] w-20 rounded-full bg-white/10 px-3 py-1.5 text-xs outline-none ring-1 ring-white/15 placeholder:text-white/60 focus:ring-white/25"
            />

            {/* Submit button (absolute to the right) */}
            <button
              type="submit"
              className="absolute right-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-1.5 text-sm font-semibold text-black shadow-md transition-all duration-200 hover:from-yellow-400 hover:to-amber-300 hover:shadow-amber-400/30"
            >
              Search
            </button>
          </form>
        </div>

        {/* Optional hero section — keep/remove as you like */}
        {/* <HeroSection ... /> */}

        {/* States */}
        {loading && (
          <p className="text-center mt-4" role="status" aria-live="polite">
            Loading…
          </p>
        )}
        {error && (
          <p className="text-center mt-4 text-red-300" role="alert">
            {error}
          </p>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}

          {!loading &&
            movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
        </div>

        {/* Pagination */}
        {!loading && movies.length > 0 && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70">
              Page <span className="font-semibold">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed margin:left-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </div>
  );
}
