import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl,LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Wallet } from '@project-serum/anchor';
// const { publicKey, struct, u64, u8, option, } = require('@project-serum/borsh')
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

const PokerGame = ({ walletAddress }) => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [pot, setPot] = useState(0);
  const [potInProgress, setPotInProgress] = useState(false);
  const [playerBalance, setPlayerBalance] = useState(1000);
  const [computerBalance, setComputerBalance] = useState(1000);

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
    // Create an array of cards
    const suits = ['♠', '♣', '♥', '♦'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const newDeck = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push({ suit, rank });
      }
    }

    setDeck(newDeck);
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
    return (
      await PublicKey.findProgramAddress(
        [Buffer.from('pot'), new BN(id).toArrayLike(Buffer, "le", id + 1)],
        programID
      )
    )[0];
  };

  const getHouseAddress = async () => {
    return (
      await PublicKey.findProgramAddress([Buffer.from('house')], programID)
    )[0];
  };

  const getBetAddress = async (pot_address, id) => {
    return (
      await PublicKey.findProgramAddress(
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
    try {
      // Connect to the Solana network
      const connection = new Connection('https://api.devnet.solana.com');

      // Fetch the program account data
      const accountInfo = await connection.getAccountInfo(new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"));
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

      const balance = await connection.getBalance(pot_address, 'confirmed');
      const pot_balance = balance / 10 ** 9; // Convert lamports to SOL
      console.log(pot_balance, 'pot_balance')


      const house_address = await getHouseAddress();
      console.log("house_address",house_address);

      const txHash = await program.methods
      .createPot(new BN(.001).mul(new BN(LAMPORTS_PER_SOL)))
        .accounts({
          pot: pot_address,
          master: master_address,
          house: house_address,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await confirmTx(txHash, connection);
      console.log(txHash, "txHash")

      console.log('accountInfo', accountInfo);
      console.log(accountInfo.data.toString());
      // const keypair = Keypair.generate(); // Generate a new key pair
      // const privateKey = keypair.secretKey;
      // console.log('Private Key:', privateKey);
      // Initialize the anchor workspace
      // const provider = AnchorProvider.local();

      // Set the provider's connection
      // provider.connection = connection;
      // // Set the provider's wallet with the private key
      // provider.wallet = new Wallet(new web3.Account(privateKey));

      // // Create an anchor program instance
      // const program = new Program("Poker", new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"), provider);
      
      // // Call the desired program function
      const accounts = await connection.getParsedProgramAccounts(programID);
      console.log(accounts);
      const create_pot = await program.rpc.createPot();
      console.log('create_pot', create_pot)

      // Perform additional operations if needed

      console.log('Function executed successfully.');
      

  
    } catch (error) {
      console.log("Error in  ", error)
    }
  }

  

  // Function to deal the initial two cards to the player and computer
  const dealInitialCards = () => {
    if (deck.length < 4) {
      alert('Not enough cards in the deck!');
      return;
    }

    const playerCards = deck.splice(0, 2);
    const computerCards = deck.splice(0, 2);
    setPlayerHand(playerCards);
    setComputerHand(computerCards);
    setPotInProgress(true);
  };

  // Function to deal an additional card to the player or computer
  const dealCard = (hand, setHand) => {
    if (deck.length === 0) {
      alert('No more cards in the deck!');
      return;
    }

    const newCard = deck[0];
    const newHand = [...hand, newCard];
    const newDeck = deck.slice(1);

    setHand(newHand);
    setDeck(newDeck);
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

      const pot_address = await getPotAddress(master.lastId);
      console.log("pot_address",pot_address);

      const pot = await program.account.pot.fetch(
        pot_address ?? (await getPotAddress())
      );
      console.log(pot, 'pot')

      const house_address = await getHouseAddress(master.lastId);

      const txHash = await program.methods
      .buyBet(pot.id)
        .accounts({
          pot: pot_address,
          bet: await getBetAddress(
            pot_address,
            pot.lastBetId + 1
          ),
          house: house_address,
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
    try {
      const connection = new Connection('https://api.devnet.solana.com');

      const program = await getProgram();
      console.log('program', program);

      const master_address = await getMasterAddress();
      console.log("master_address",master_address);
      const master = await program.account.master.fetch(
        master_address ?? (await getMasterAddress())
      );

      const pot_address = await getPotAddress(master.lastId);
      console.log("pot_address",pot_address);

      const pot = await program.account.pot.fetch(
        pot_address ?? (await getPotAddress())
      );
      console.log(pot, 'pot')

      const bet_address = await getBetAddress(
        pot_address,
        pot.lastBetId
      )
      console.log(bet_address, 'bet_address')
      const bet = await program.account.bet.fetch(bet_address)

      const house_address = await getHouseAddress();

      console.log(bet, 'bet')

      const txHash = await program.methods
      .claimPot(pot.id, bet.id)
        .accounts({
          pot: pot_address,
          bet: bet_address,
          house: house_address,
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


    setPlayerBalance(playerBalance + pot);
    setPot(0);
    setPotInProgress(false);
  };

  // Helper function to calculate the rank of the player's hand (for simplicity, let's just use the highest card rank)
  const getPlayerHandRank = () => {
    const ranks = playerHand.map((card) => card.rank);
    const maxRank = Math.max(...ranks);
    return maxRank;
  };

  // Helper function to calculate the rank of the computer's hand (for simplicity, let's just use the highest card rank)
  const getComputerHandRank = () => {
    const ranks = computerHand.map((card) => card.rank);
    const maxRank = Math.max(...ranks);
    return maxRank;
  };

  // Render the game UI
  return (
    <div>
      <button onClick={initializeDeck}>Initialize Deck</button>
      <button onClick={initializePot}>Initialize Pot</button>
      <button onClick={dealInitialCards}>Deal Initial Cards</button>
      <button onClick={() => dealCard(playerHand, setPlayerHand)} disabled={!potInProgress}>
        Deal Card
      </button>
      <button onClick={() => dealCard(computerHand, setComputerHand)} disabled={!potInProgress}>
        Computer Deal
      </button>
      <button onClick={placeBet} disabled={!potInProgress}>
        Place Bet
      </button>
      <button onClick={determineWinner} disabled={!potInProgress}>
        Determine Winner
      </button>

      <h2>Player Hand</h2>
      <ul>
        {playerHand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Computer Hand</h2>
      <ul>
        {computerHand.map((card, index) => (
          <li key={index}>
            {card.rank} of {card.suit}
          </li>
        ))}
      </ul>

      <h2>Pot: ${pot}</h2>
      <SolBalance userName="Player" walletAddress={walletAddress} />
      <h2>Computer Balance: ${computerBalance}</h2>
    </div>
  );
};

export default PokerGame;
