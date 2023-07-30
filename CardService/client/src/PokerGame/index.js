import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl,LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Wallet } from '@project-serum/anchor';
// const { publicKey, struct, u64, u8, option, } = require('@project-serum/borsh')
import store, { addStoreFlop } from '../store';
import axios from 'axios';
import SolBalance from '../SolBalance';
import IDL from "./idl.json";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU");

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

const syncFlop = (flop) => {
  console.log(flop);
  const socket = new WebSocket("ws://localhost:3001/echo2");
  socket.addEventListener('flop', (flop) => {
      console.log("socket-flop", flop.data);
      store.dispatch(addStoreFlop({storeFlop: flop.data}));
  });
  socket.onopen = () => socket.send(flop);
}

const PokerGame = ({ walletAddress }) => {
  const [deck, setDeck] = useState([]);
  const [flop, setFlop] = useState([]);
  const [doneInitFlop, setDoneInitFlop] = useState(false);
  const [playerAHand, setPlayerAHand] = useState([]);
  const [playerBHand, setPlayerBHand] = useState([]);
  const {opponents, storeFlop} = store.getState();
  const [pot, setPot] = useState(0);
  const [potInProgress, setPotInProgress] = useState(false);
  const [playerBalance, setPlayerBalance] = useState(1000);
  const [opponentList, setOpponentList] = useState(opponents);
  const [storeFlopList, setStoreFlopList] = useState(storeFlop);


  useEffect(() => {
    initializeDeck();
  }, []);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    console.log('provider',provider);
    return provider;
    
  }

  // Function to initialize the deck of cards
  const initializeDeck = () => {

    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3001/shuffle/');
        const newDeck = result.data['deck'];
        setDeck(newDeck);
        setFlop([]);
        setPlayerAHand([]);
        setPlayerBHand([]);
        setDoneInitFlop(false);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();    
  };

  const initializeFlop = async () => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3001/flop/');
        const flop = result.data;
        setFlop(flop);
        store.dispatch(addStoreFlop({storeFlop: flop}));
        syncFlop(flop);
        setDoneInitFlop(true);
        console.log('flop', flop);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();  
  };

  const getProgram = async () => {
    // Get metadata about your solana program
    console.log('programID',programID);

    // Create a program that you can call
    return new Program(IDL, programID, getProvider());
  };


  const getMasterAddress = async () => {
    return (
      await PublicKey.findProgramAddress([Buffer.from('master')], programID)
    )[0];
  };

  const getPotAddress = async (id) => {
    console.log('id', id);
    return (
      await PublicKey.findProgramAddressSync(
        [Buffer.from('pot'), new BN(id).toArrayLike(Buffer, "le", 4)],
        programID
      )
    )[0];
  };

  const getHouseAddress = async () => {
    return new PublicKey('HHNCrJuKVtzRPuD3DVpcXkQA8dCuQ1U1KPntS9VKxFd7');
  };

  const getBetAddress = async (pot_address, id) => {
    return (
      await PublicKey.findProgramAddressSync(
        [
          Buffer.from('bet'),
          pot_address.toBuffer(),
          new BN(id).toArrayLike(Buffer, "le", 4),
        ],
        programID
      )
    )[0];
  }

  const confirmTx = async (txHash, connection) => {
    const blockhashInfo = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: blockhashInfo.blockhash,
      lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
      signature: txHash,
    });
  };


  const initializePot = async () => {
    // Connect to the Solana network
    const connection = new Connection('https://api.devnet.solana.com');

    // Fetch the program account data
    const accountInfo = await connection.getAccountInfo(new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"));
    const program = await getProgram();
    
    const master_address = await getMasterAddress();

    const master = await program.account.master.fetch(
      master_address ?? (await getMasterAddress())
    );
    
    const pot_address = await getPotAddress(master.lastId + 1);
    console.log(pot_address.toString())

    const balance = await connection.getBalance(pot_address, 'confirmed');
    const pot_balance = balance / 10 ** 9; // Convert lamports to SOL


    const house_address = await getHouseAddress();

    const txHash = await program.methods
    .createPot(new BN(100000000))
      .accounts({
        pot: pot_address,
        master: master_address,
        house: walletAddress,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    await confirmTx(txHash, connection);
    const newBalance = await connection.getBalance(pot_address, 'confirmed');
    const pot_solBalance = newBalance / 10 ** 9; // Convert lamports to SOL
    setPot(pot_solBalance)

  }

  

  // Function to deal the initial two cards to the player and computer    
  const dealInitialCards = async () => {
    try {
      const playerACardsResult = await axios.post('http://localhost:3001/hand/', {player: walletAddress});
      setPlayerAHand(playerACardsResult.data);
      setPotInProgress(true);
    } catch (error) {
      console.error(error);
    }
  };
    
  // Function to deal an additional card to the table
  const dealCard = () => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3001/river/');
        const flop = result.data;
        setFlop(flop);
        console.log('flop', flop);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  };

  // Function to handle placing a bet
  const placeBet = async () => {
    try {
      const connection = new Connection('https://api.devnet.solana.com');

      const program = await getProgram();
      console.log('program', program);

      const master_address = await getMasterAddress();
      console.log("master_address",master_address);
      const master = await program.account.master.fetch(
        master_address ?? (await getMasterAddress())
      );
      console.log(master, 'master')

      const pot_address = await getPotAddress(master.lastId);
      console.log("pot_address",pot_address);

      const pot = await program.account.pot.fetch(
        pot_address ?? (await getPotAddress(master.lastId))
      );
      console.log('pot_address', pot_address.toString())
      const pot_balance = await connection.getBalance(pot_address, 'confirmed') / 10 ** 9; // Convert lamports to SOL
      console.log('pot_balance', pot_balance);

      const house_address = await getHouseAddress();
      console.log("house_address",house_address.toString());

      const txHash = await program.methods
      .buyBet(pot.id)
        .accounts({
          pot: pot_address,
          bet: await getBetAddress(
            pot_address,
            pot.lastBetId + 1
          ),
          house: walletAddress,
        })
        .rpc();
      await confirmTx(txHash, connection);
      console.log(txHash, "txHash")
      const balance = await connection.getBalance(pot_address, 'confirmed');
      const pot_solBalance = balance / 10 ** 9; // Convert lamports to SOL
      setPot(pot_solBalance)

    } catch (error) {
      console.log("Error in  ", error)
    }

    // setPot(pot + 10); // Increment the pot by 10 (you can adjust the bet amount as needed)
    // setPlayerBalance(playerBalance - 10);
    // setComputerBalance(computerBalance - 10);
  };

  // Function to determine the winner based on hand strength
  const determineWinner = async () => {
    const connection = new Connection('https://api.devnet.solana.com');

    const program = await getProgram();

    const master_address = await getMasterAddress();
    const master = await program.account.master.fetch(
      master_address ?? (await getMasterAddress())
    );

    const pot_address = await getPotAddress(master.lastId);

    const pot = await program.account.pot.fetch(
      pot_address ?? (await getPotAddress())
    );
    console.log('pot_address', pot_address.toString());

    const bet_address = await getBetAddress(
      pot_address,
      pot.lastBetId
    )
    console.log('bet_address', bet_address.toString());

    const bet = await program.account.bet.fetch(bet_address)

    const house_address = await getHouseAddress();
    console.log('walletAddress', walletAddress.toString())

    console.log('pot id', pot.id);
    console.log('bet id', bet.id);

    const txHash = await program.methods
    .claimPot(pot.id, bet.id)
      .accounts({
        pot: pot_address,
        house: walletAddress,
      })
      .rpc();
    await confirmTx(txHash, connection);
    console.log(txHash, "txHash")
    const balance = await connection.getBalance(pot_address, 'confirmed');
    const pot_solBalance = balance / 10 ** 9; // Convert lamports to SOL
    setPot(pot_solBalance)


  setPlayerBalance(playerBalance + pot);
  setPot(0);
  setPotInProgress(false);
  };

  // Helper function to calculate the rank of the player's hand (for simplicity, let's just use the highest card rank)
  const getPlayerHandRank = () => {
    const ranks = playerAHand.map((card) => card.rank);
    const maxRank = Math.max(...ranks);
    return maxRank;
  };

  // Helper function to calculate the rank of the computer's hand (for simplicity, let's just use the highest card rank)
  const getComputerHandRank = () => {
    const ranks = playerBHand.map((card) => card.rank);
    const maxRank = Math.max(...ranks);
    return maxRank;
  };

  store.subscribe(() => {
    setOpponentList(
      store.getState().opponents.filter((address) => {
        console.log(address, walletAddress.toString());
        return address[0] !== walletAddress.toString();
      })
    )
  });
  console.log(opponentList);

  store.subscribe(() => {
    setStoreFlopList(
      store.getState().storeFlop
    )
  });
  console.log(storeFlopList);

  // Render the game UI
  return (
    <div>
      <button onClick={initializeDeck}>Initialize Deck</button>
      <button onClick={initializeFlop} disabled={doneInitFlop}>Initialize Flop</button>
      <button onClick={initializePot}>Initialize Pot</button>
      <button onClick={dealInitialCards}>Deal Initial Cards to Players</button>
      <button onClick={dealCard}>
        Deal Card to Table
      </button>
      <button onClick={placeBet} disabled={!potInProgress}>
        Place Bet
      </button>
      <button onClick={determineWinner} disabled={!potInProgress}>
        Determine Winner
      </button>

      <h2>Flop</h2>
      <ul>
        {flop.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Player A Hand</h2>
      <ul>
        {playerAHand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Other Players</h2>
      <ul>
        {opponentList.map((address) => (
          <li key={address}>
            {address}
          </li>
        ))}
      </ul>

      <h2>Pot: ${pot}</h2>
      <SolBalance userName="Player" walletAddress={walletAddress} />
    </div>
  );
};

export default PokerGame;
