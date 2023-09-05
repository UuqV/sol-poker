import React, { useState, useEffect } from 'react';
import {dealInitialCards, dealCard, placeBet, determineWinner} from '../state/actions';
import SolBalance from '../SolBalance';
import store, { initialize } from '../state/store';

const PokerGame = () => {
  const {opponents, table, player} = store.getState();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div>
      <button onClick={dealCard}>
        Deal Card to Table
      </button>
      <button onClick={placeBet} disabled={table.inProgress}>
        Place Bet
      </button>
      <button onClick={determineWinner} disabled={table.inProgress}>
        Determine Winner
      </button>

      <h2>Flop</h2>
      <ul>
        {table.cards.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Player Hand</h2>
      <ul>
        {player.hand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Other Players</h2>
      <ul>
        {opponents.map((address) => (
          <li key={address}>
            {address}
          </li>
        ))}
      </ul>

      <h2>Pot: ${table.pot}</h2>
      <SolBalance userName="Player" walletAddress={player.walletAddress} />
    </div>
  );
};

export default PokerGame;
