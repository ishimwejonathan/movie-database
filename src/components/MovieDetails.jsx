const MovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-2xl p-6 w-11/12 max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-300 text-2xl"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-48 rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{movie.Title}</h2>
            <p className="text-sm mb-2">{movie.Plot}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Cast:</strong> {movie.Actors}</p>
            <p><strong>Released:</strong> {movie.Released}</p>
            <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
