import { useEffect, useState } from "react";

const PreviewGallery = ({ apiKey, title, searchTerm, onPick }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`
        );
        const data = await res.json();
        if (data.Response === "True") {
          setMovies(data.Search.slice(0, 4)); // limit to 6 results
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError("Failed to load previews.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [apiKey, searchTerm]);

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {loading && <p className="text-sm text-white/60">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <button
            key={movie.imdbID}
            onClick={() => onPick && onPick(movie)}
            className="group overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 hover:ring-white/30 transition"
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : `https://via.placeholder.com/300x400?text=${movie.Title}`
              }
              alt={movie.Title}
              className="h-64 w-full object-cover transition group-hover:scale-[1.05]"
            />
            <div className="p-2 text-left">
              <p className="text-sm font-medium line-clamp-2">{movie.Title}</p>
              <p className="text-xs text-white/60">{movie.Year}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default PreviewGallery;
