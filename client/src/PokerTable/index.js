import React, { useEffect, useState } from 'react';
import './PokerTable.css';

function Table({ cards, potBalance}) {
  let roundedPotBalance = parseFloat(potBalance.toFixed(2));
  return (
    <div class="poker-table">
      <div class="pot">
          {cards.map((card, index) => (
              <div class="card">
                  {card.suit}{card.rank}
              </div>
              ))}   
      </div>
      <h2>Pot: ${roundedPotBalance} SOL</h2>
    </div>
  );
}


export default Table;