import React, { useState, useEffect } from 'react';
import {dealCard, placeBet, determineWinner} from '../state/actions';
import SolBalance from '../SolBalance';
import {connect} from 'react-redux';

const PokerGame = ({opponents, table, player}) => {
  const {wallet, hand} = player;
  const {cards} = table;

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
        {cards.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Player Hand</h2>
      <ul>
        {hand.map((card, index) => (
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
      <SolBalance userName="Player" wallet={wallet} />
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