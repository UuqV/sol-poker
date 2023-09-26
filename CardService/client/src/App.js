import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, Wallet } from '@project-serum/anchor';
import store, {connectSocket, addOpponents} from './state/store';
import PokerGame from './PokerGame';
import {setWallet} from './state/store';
import { init } from './state/actions';
import {connect} from 'react-redux';
import socket from './socket';


const App = ({wallet}) => {

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          store.dispatch(setWallet({wallet: response.publicKey.toString()}));
          console.log('socket', wallet);
          socket.send(JSON.stringify({action: "CONNECTION", wallet: response.publicKey.toString()}));
          init(wallet);
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      store.dispatch(setWallet({wallet: response.publicKey.toString()}));
      socket.send(JSON.stringify({action: "CONNECTION", wallet: response.publicKey.toString()}));
    }
  };

    /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">Poker Game</p>
          <p className="sub-text">Poker Game</p>
          {/* Render your connect to wallet button right here */}
          {!wallet && renderNotConnectedContainer()}
        </div>
        {/* Check for wallet and then pass in wallet */}
        {wallet && <PokerGame />}
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    wallet: state.player.wallet
  }
}


export default connect(mapStateToProps)(App);
