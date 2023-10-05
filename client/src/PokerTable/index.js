import React, { useEffect, useState } from 'react';
import './PokerTable.css';

function Table({ cards, potBalance}) {
  let roundedPotBalance = parseFloat(potBalance.toFixed(2));
  return (
    <div className="poker-table">
      <div className="pot">
          {cards.map((card, index) => (
              <div className="card">
                  {card.suit}{card.rank}
              </div>
              ))}   
      </div>
      <h2>Pot: ${roundedPotBalance} SOL</h2>
    </div>
  );
}


export default Table;