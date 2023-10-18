import React, { useState, useEffect } from 'react';
import { fold, bet } from '../state/actions';
// import WinnerAnnounc  ement from '../WinnerAnnouncement';

import SolBalance from '../SolBalance';
import PokerTable from '../PokerTable';
import OtherPlayer from '../OtherPlayers';
import Player from '../Player';
import './PokerGame.css';
import { connect, useSelector } from 'react-redux';
import store, { setWinner } from '../state/store';

const PokerGame = ({ opponents, table, player }) => {
  const { wallet, hand, isTurn, balance } = player;
  const { cards } = table;


  return (
    <div className="poker-game">
      <PokerTable cards={cards} potBalance={table.pot}/>
      <OtherPlayer opponents={opponents}  winner={store.getState().winner }/>
      <Player hand={hand} />
      <div className="player-bottom-bar">
        <div className="buttons-container">
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