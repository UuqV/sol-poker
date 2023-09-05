import React, { useState, useEffect } from 'react';
import {initialize, dealInitialCards, dealCard, placeBet, determineWinner} from '../state/actions';
import SolBalance from '../SolBalance';
import store from '../state/store';

const PokerGame = ({ walletAddress }) => {
  const {opponents} = store.getState();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div>
      <button onClick={dealCard}>
        Deal Card to Table
      </button>
      <button onClick={placeBet} disabled={!potInProgress}>
        Place Bet
      </button>
      <button onClick={determineWinner} disabled={!potInProgress}>
        Determine Winner
      </button>

      <h2>Flop</h2>
      <ul>
        {flop.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Player A Hand</h2>
      <ul>
        {playerAHand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Other Players</h2>
      <ul>
        {opponentList.map((address) => (
          <li key={address}>
            {address}
          </li>
        ))}
      </ul>

      <h2>Pot: ${pot}</h2>
      <SolBalance userName="Player" walletAddress={walletAddress} />
    </div>
  );
};

export default PokerGame;
