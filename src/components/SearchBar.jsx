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
    <form onSubmit={handleSubmit} className="flex justify-center gap-2">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 w-64 rounded-md text-black"
      />
      <button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-semibold"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
