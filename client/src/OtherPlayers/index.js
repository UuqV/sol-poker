import React, { useEffect, useState } from 'react';
import './OtherPlayers.css';

function OtherPlayer({ opponents, winner }) {
  const [winnerColor, setWinnerColor] = useState('white');

  useEffect(() => {
    if (winner) {
      setWinnerColor('green');
      // After 2 seconds, change the text color back to white
      const timer = setTimeout(() => {
        setWinnerColor('white');
        winner = null;
      }, 5000);
      // Clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [winner]);

  return (
    <div className="otherPlayers">
        <h2>Other Players</h2>
            {opponents && opponents.map((address) => (
                <p style={{ color: address === winner ? winnerColor : 'white' }} key={address}>
                    {address}
                </p>
            ))}
    </div>
  );
}


export default OtherPlayer;