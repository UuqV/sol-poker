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
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    console.log('handleCloseModal');
    store.dispatch(setWinner(null));
    console.log('winner state',store.getState().winner);
    setShowModal(false);
  };

  useEffect(() => {
      if (store.getState().winner) {
          setShowModal(true);
      }
  }, [store.getState().winner]); // This effect will run every time `winner` changes

  return (
    <div className="poker-game">
      <PokerTable cards={cards} potBalance={table.pot}/>
      <OtherPlayer opponents={opponents} />
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
      {showModal && 
      <div className="modal-overlay">
          <div className="modal-content">
              <p>{store.getState().winner}</p>
              <p>has won the poker game!</p>
              <button onClick={handleCloseModal}>Close</button>
          </div>
      </div>}
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