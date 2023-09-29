import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {connect} from 'react-redux';


function SolBalance({ balance }) {
  console.log('solbalance', balance);

  return (
    <div>
      {balance !== null ? (
        <h2>Balance: {balance} SOL</h2>
      ) : (
        <h2>Loading balance...</h2>
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