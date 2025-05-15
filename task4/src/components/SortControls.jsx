import React from "react";

function SortControls({ sortBy, setSortBy }) {
  return (
    <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
      <option value="name">Name</option>
      <option value="rating">Rating</option>
    </select>
  );
}

export default SortControls;
