import React, { useEffect, useState } from 'react';
import './Player.css';

function Player({ hand }) {
  return (
    <div className="player">
        <h2>Your Hand</h2>
        <div className="poker-hand">
        {hand && hand.map((card, index) => (
            <div className="card">{card.suit}{card.rank}</div>
            ))}
        </div>
    </div>
  );
}


export default Player;