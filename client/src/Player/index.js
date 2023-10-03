import React, { useEffect, useState } from 'react';
import './Player.css';

function Player({ hand }) {
  return (
    <div class="player">
        <h2>Your Hand</h2>
        <div class="poker-hand">
        {hand && hand.map((card, index) => (
            <div class="card">{card.suit}{card.rank}</div>
            ))}
        </div>
    </div>
  );
}


export default Player;