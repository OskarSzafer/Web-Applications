import React, { useState, useEffect } from "react";
import gamesData from "../data.json";
import GameList from "./GameList";
import AddGameForm from "./AddGameForm";
import SearchBar from "./SearchBar";
import SortControls from "./SortControls";

function App() {
  const [games, setGames] = useState(gamesData);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const handleAddGame = (game) => {
    setGames(prev => [...prev, { ...game, id: Date.now() }]);
  };

  const handleDelete = (id) => {
    setGames(prev => prev.filter(g => g.id !== id));
  };

  const handleRate = (id, rating) => {
    setGames(prev => prev.map(g => g.id === id ? { ...g, rating } : g));
  };

  const filteredGames = games
    .filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const valueA = a[sortBy] || ""; // Default to an empty string if the property is undefined
      const valueB = b[sortBy] || ""; // Default to an empty string if the property is undefined

      if (sortBy === "rating") {
        // Ensure numeric comparison for ratings
        return (valueB || 0) - (valueA || 0);
      }

      // Default to string comparison for other fields
      return valueA.toString().localeCompare(valueB.toString());
    });

  return (
    <div>
      <h1>🎮 My Game Collection</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <SortControls sortBy={sortBy} setSortBy={setSortBy} />
      <AddGameForm onAdd={handleAddGame} />
      <GameList games={filteredGames} onDelete={handleDelete} onRate={handleRate} />
    </div>
  );
}

export default App;
