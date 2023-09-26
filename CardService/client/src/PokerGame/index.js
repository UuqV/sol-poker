import React, { useState, useEffect } from 'react';
import {dealCard, placeBet, determineWinner} from '../state/actions';
import SolBalance from '../SolBalance';
import {connect} from 'react-redux';

const PokerGame = ({opponents, table, player}) => {
  const {wallet, hand, isTurn} = player;
  const {cards} = table;

  return (
    <div>
      <button onClick={placeBet} disabled={!player.isTurn}>
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