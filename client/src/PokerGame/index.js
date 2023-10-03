import React, { useState, useEffect } from 'react';
import { dealCard, determineWinner, fold, bet } from '../state/actions';
import SolBalance from '../SolBalance';
import Table from '../PokerTable';
import OtherPlayer from '../OtherPlayers';
import Player from '../Player';
import './PokerGame.css';
import { connect } from 'react-redux';

const PokerGame = ({ opponents, table, player }) => {
  const { wallet, hand, isTurn, balance } = player;
  const { cards } = table;

  return (
    <div class="poker-game">
      <Table cards={cards} potBalance={table.pot}/>
      <OtherPlayer opponents={opponents} />
      <Player hand={hand} />
      <div class="player-bottom-bar">
        <div class="buttons-container">
          <button className="action-button fold-button" onClick={fold} disabled={!player.isTurn}>
            Fold
          </button>
          <button className="action-button place-bet-button" onClick={() => bet(wallet)} disabled={!player.isTurn}>
            Place Bet
          </button>
          
        </div>
        <SolBalance userName="Player" balance={balance} />
      </div>
      
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