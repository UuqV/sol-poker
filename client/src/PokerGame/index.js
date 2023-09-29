import React, { useState, useEffect } from 'react';
import { dealCard, determineWinner, fold, bet } from '../state/actions';
import SolBalance from '../SolBalance';
import { connect } from 'react-redux';

const PokerGame = ({ opponents, table, player }) => {
  const { wallet, hand, isTurn, balance } = player;
  const { cards } = table;

  return (
    <div>
      <button onClick={fold} disabled={!player.isTurn}>
        Fold
      </button>
      <button onClick={() => bet(wallet)} disabled={!player.isTurn}>
        Place Bet
      </button>

      <h2>Flop</h2>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Player Hand</h2>
      <ul>
        {hand && hand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Other Players</h2>
      <ul>
        {opponents && opponents.map((address) => (
          <li key={address}>
            {address}
          </li>
        ))}
      </ul>

      <h2>Pot: ${table.pot}</h2>
      <SolBalance userName="Player" balance={balance} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    opponents: state.opponents,
    table: state.table,
    player: state.player,
  }
}


export default connect(mapStateToProps)(PokerGame);