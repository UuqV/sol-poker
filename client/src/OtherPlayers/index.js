import React, { useEffect, useState } from 'react';
import './OtherPlayers.css';
import store, { setWinner } from '../state/store';


function OtherPlayer({ opponents }) {
  const [winnerColor, setWinnerColor] = useState('white');
  // let [currentWinner, setCurrentWinner] = useState(null);
  // currentWinner = winner;

  useEffect(() => {
    console.log('----------in OtherPlayer.js useEffect, winner: ', store.getState().winner);
    if (store.getState().winner) {
      setWinnerColor('green');
      // After 5 seconds, change the text color back to white
      const timer = setTimeout(() => {
        setWinnerColor('white');
        //setCurrentWinner(null);
        store.dispatch(setWinner(null));
        console.log('-----------in OtherPlayer.js useEffect, winner: after--: ', store.getState().winner);
      }, 5000);
      // Clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [store.getState().winner]);

  return (
    <div className="otherPlayers">
        <h2>Other Players</h2>
            {opponents && opponents.map((address) => (
                <p style={{ color: address === store.getState().winner ? winnerColor : 'white' }} key={address}>
                    {address}
                </p>
            ))}
    </div>
  );
}


export default OtherPlayer;