const MovieCard = ({ movie, onClick }) => {
  return (
    <div
      onClick={() => onClick(movie.imdbID)}
      className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
        alt={movie.Title}
        className="w-full h-64 object-cover"
      />
      <div className="p-3 text-white">
        <h3 className="text-lg font-semibold">{movie.Title}</h3>
        <p className="text-sm text-gray-400">{movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
