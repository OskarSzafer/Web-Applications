import React from "react";

function SearchBar({ query, setQuery }) {
  return (
    <input
      placeholder="Search games..."
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

export default SearchBar;
