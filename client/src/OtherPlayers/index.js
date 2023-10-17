import React, { useEffect, useState } from 'react';
import './OtherPlayers.css';

function OtherPlayer({ opponents}) {
  return (

    <div className="otherPlayers">
        <h2>Players</h2>
            {opponents && opponents.map((address) => (
                <p key={address}>
                    {address}
                </p>
            ))}
    </div>
  );
}


export default OtherPlayer;