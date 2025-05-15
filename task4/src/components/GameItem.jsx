import React from "react";

function GameItem({ game, onDelete, onRate }) {
  return (
    <div className="card">
      <h3>{game.name}</h3>
      <img src={game.image} alt={game.name} />
      <p>{game.description}</p>
      <p>⭐ {game.rating}</p>
      <button onClick={() => onRate(game.id, game.rating + 1)}>+1 Star</button>
      <button onClick={() => onRate(game.id, game.rating - 1)}>-1 Star</button>
      <button onClick={() => onDelete(game.id)}>Delete</button>
    </div>
  );
}

export default GameItem;
