import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto flex w-full max-w-md items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-md transition-all duration-300 hover:border-amber-400/60 hover:bg-white/15 focus-within:border-amber-400/80"
    >
      {/* 🔍 Search icon replacement (emoji or custom SVG) */}
      <span className="absolute left-4 text-white/70 text-lg">🔍</span>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search your favourite movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-transparent pl-10 pr-28 text-sm text-white placeholder:text-white/60 focus:outline-none"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="absolute right-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-1.5 text-sm font-semibold text-black shadow-md transition-all duration-200 hover:from-yellow-400 hover:to-amber-300 hover:shadow-amber-400/30"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
