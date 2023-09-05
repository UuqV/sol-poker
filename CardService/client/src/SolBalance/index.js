import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {connect} from 'react-redux';


function SolBalance({ userName, wallet }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    getSolBalance(wallet);
  }, [wallet]);

  async function getSolBalance(address) {
    const connection = new Connection('https://api.devnet.solana.com');

    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey, 'confirmed');
      const solBalance = balance / 10 ** 9; // Convert lamports to SOL
      setBalance(solBalance);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  return (
    <div>
      {balance !== null ? (
        <h2>{userName} Balance: {balance} SOL</h2>
      ) : (
        <h2>{userName} Loading balance...</h2>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wallet: state.player.wallet,
  }
}


export default connect(mapStateToProps)(SolBalance);