import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, Wallet } from '@project-serum/anchor';
// const { publicKey, struct, u64, u8, option, } = require('@project-serum/borsh')
import SolBalance from '../SolBalance';
import IDL from "./idl.json";


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
  const [roundInProgress, setRoundInProgress] = useState(false);
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
    // const idl = await Program.fetchIdl(programID, getProvider());
    // console.log('idl------');
    // console.log(idl);

    // Create a program that you can call
    return new Program(IDL, programID, getProvider());
  };


  const getTableAddress = async () => {
    return (
      await PublicKey.findProgramAddress([Buffer.from('table')], programID)
    )[0];
  };

  const initializePot = async () => {
    try {
      // Connect to the Solana network
      const connection = new Connection('https://api.devnet.solana.com');

      // Fetch the program account data
      const accountInfo = await connection.getAccountInfo(new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"));
      const program = await getProgram();
      console.log('program', program);
      console.log('accountInfo', accountInfo);
      console.log(accountInfo.data.toString());
      const keypair = Keypair.generate(); // Generate a new key pair
      const privateKey = keypair.secretKey;
      console.log('Private Key:', privateKey);
      // Initialize the anchor workspace
      // const provider = AnchorProvider.local();

      // Set the provider's connection
      // provider.connection = connection;
      // // Set the provider's wallet with the private key
      // provider.wallet = new Wallet(new web3.Account(privateKey));

      // // Create an anchor program instance
      // const program = new Program("Poker", new PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"), provider);
      const table_address = await getTableAddress();
      console.log("table_address",table_address);
      // // Call the desired program function
      const accounts = await connection.getParsedProgramAccounts(programID);
      console.log(accounts);
      const create_round = await program.rpc.createRound();
      console.log('create_round', create_round)

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
    setRoundInProgress(true);
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
  const placeBet = () => {
    if (playerBalance < 10) {
      alert('Insufficient balance!');
      return;
    }

    setPot(pot + 10); // Increment the pot by 10 (you can adjust the bet amount as needed)
    setPlayerBalance(playerBalance - 10);
    setComputerBalance(computerBalance - 10);
  };

  // Function to determine the winner based on hand strength
  const determineWinner = () => {
    // You can implement your own hand evaluation logic here
    // For simplicity, let's assume the player wins if they have a higher rank than the computer

    const playerRank = getPlayerHandRank();
    const computerRank = getComputerHandRank();

    if (playerRank > computerRank) {
      alert('Player wins!');
      setPlayerBalance(playerBalance + pot);
    } else if (playerRank < computerRank) {
      alert('Computer wins!');
      setComputerBalance(computerBalance + pot);
    } else {
      alert("It's a tie!");
      setPlayerBalance(playerBalance + pot / 2);
      setComputerBalance(computerBalance + pot / 2);
    }

    setPot(0);
    setRoundInProgress(false);
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
      <button onClick={() => dealCard(playerHand, setPlayerHand)} disabled={!roundInProgress}>
        Deal Card
      </button>
      <button onClick={() => dealCard(computerHand, setComputerHand)} disabled={!roundInProgress}>
        Computer Deal
      </button>
      <button onClick={placeBet} disabled={!roundInProgress}>
        Place Bet
      </button>
      <button onClick={determineWinner} disabled={!roundInProgress}>
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
