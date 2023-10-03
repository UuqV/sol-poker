import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {connect} from 'react-redux';


function SolBalance({ balance }) {
  let roundedBalance = parseFloat(balance.toFixed(2));
  return (
    <div class="player-balance">
      {balance !== null ? (
        <p>Your Balance: {roundedBalance} SOL</p>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wallet: state.player.wallet,
    balance: state.player.balance,
  }
}


export default connect(mapStateToProps)(SolBalance);