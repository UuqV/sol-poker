import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, Wallet } from '@project-serum/anchor';
import store, {addStoreFlop, addOpponents} from './store';
import PokerGame from './PokerGame';


const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  const getSocket = (walletAddress) => {
    console.log(walletAddress);
    const socket = new WebSocket("ws://localhost:3001/echo");
    socket.addEventListener('message', (message) => {
        console.log("message", message.data);
        store.dispatch(addOpponents({opponents: message.data}));
    });
    socket.onopen = () => socket.send(walletAddress);
  }

  // const syncFlop = (flop) => {
  //   console.log(flop);
  //   const socket = new WebSocket("ws://localhost:3001/echo2");
  //   socket.addEventListener('message', (message) => {
  //       console.log("message-flop", message.data);
  //       store.dispatch(addStoreFlop({storeFlop: message.data}));
  //   });
  //   socket.onopen = () => socket.send(flop);
  // }

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
          console.log('window.solana', window.solana)
          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
          getSocket(response.publicKey.toString());
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
      setWalletAddress(response.publicKey.toString());
      getSocket(response.publicKey.toString());
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
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/* Check for walletAddress and then pass in walletAddress */}
        {walletAddress && <PokerGame walletAddress={walletAddress} />}
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
};


export default App;
