import React from "react";

// Define the Movie type and export it so MovieDetails can use it too
export type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;

  // Optional fields (used in MovieDetails)
  Plot?: string;
  Genre?: string;
  Actors?: string;
  Released?: string;
  imdbRating?: string;
};

// Define props for this component
type MovieCardProps = {
  movie: Movie;
  onClick: (movie: Movie) => void;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div
      onClick={() => onClick(movie)}
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
