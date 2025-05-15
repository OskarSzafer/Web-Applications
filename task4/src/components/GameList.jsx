import React from "react";
import GameItem from "./GameItem";

function GameList({ games, onDelete, onRate }) {
  if (games.length === 0) return <p>No games found.</p>;

  return (
    <div>
      {games.map(game => (
        <GameItem key={game.id} game={game} onDelete={onDelete} onRate={onRate} />
      ))}
    </div>
  );
}

export default GameList;
