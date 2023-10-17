import React, { useEffect, useState } from 'react';
import './PokerTable.css';

function Table({ cards, potBalance}) {
  console.log("potBalance", potBalance);
  let roundedPotBalance = parseFloat(potBalance.toFixed(2));
  return (
    <div className="poker-table">
      <div className="pot">
          {cards.map((card, index) => {
            console.log(card);
            return (
              <div class={"card " + card.pokerSuit}>
                  {card.rank}{card.suit}
              </div>
              )
            })}   
      </div>
      <h2>Pot: ${roundedPotBalance} SOL</h2>
    </div>
  );
}


export default Table;