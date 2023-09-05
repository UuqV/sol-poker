// import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
// import { Program, AnchorProvider, web3, Wallet } from '@project-serum/anchor';
var web3 = require('@solana/web3.js');
var anchor = require('@project-serum/anchor');
var express = require('express');
const cors = require('cors');
var router = express.Router();
var IDL  = require("./idl");

// Enable CORS for all routes
router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
const network = web3.clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

const programID = new web3.PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU");

const getProvider = () => {
  const connection = new web3.Connection(network, opts.preflightCommitment);
  const provider = new anchor.AnchorProvider(
    connection, web3.solana, opts.preflightCommitment,
  );
  return provider;

}

const getProgram = async () => {;
  return new anchor.Program(IDL, programID, getProvider());
};

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

  // Fisher-Yates shuffle algorithm
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }

  return newDeck;
};

let deck = initializeDeck();

let hands = [];
let commonCards = [];

const getTableAddress = async () => {
  return (
    await web3.PublicKey.findProgramAddress([Buffer.from('table')], programID)
  )[0];
};

router.post('/hand/', function(req, res) {

  deck = initializeDeck();

  hands = [];
  commonCards = [];

  const {player} = req.body;

  console.log(player);

  const dealInitialCards = () => {
    if (deck.length < 4) {
      res.errored('Not enough cards in the deck!');
      return;
    }

    const playerCards = deck.splice(0, 2);
    return playerCards;
  };

  const cards = dealInitialCards();
  hands.push({[player]: cards});
  res.send(cards);
});

router.get('/flop/', function(req, res, next) {
  
  // Function to deal the initial two cards to the player and computer
  const dealFlop = () => {
    if (deck.length < 4) {
      res.errored('Not enough cards in the deck!');
      return;
    }

    const flopCards = deck.splice(0, 3);
    return flopCards;
  };

  const cards = dealFlop();
  commonCards.push(cards);
  commonCards = commonCards.flat();
  res.send(commonCards);
});

router.get('/river/', function(req, res, next) {
  
  // Function to deal the initial two cards to the player and computer
  const dealFlop = () => {
    if (deck.length < 4) {
      res.errored('Not enough cards in the deck!');
      return;
    }

    const flopCards = deck.splice(0, 1);
    return flopCards;
  };

  const cards = dealFlop();
  commonCards.push(cards);
  commonCards = commonCards.flat();
  res.send(commonCards);
});

router.get('/table/', async function (req, res, next) {
  
  try {
    // Connect to the Solana network
    const connection = new web3.Connection('https://api.devnet.solana.com');

    // Fetch the program account data
    const accountInfo = await connection.getAccountInfo(new web3.PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"));
    const program = await getProgram();
    const table_address = await getTableAddress();
    const accounts = await connection.getParsedProgramAccounts(programID);
    const create_round = await program.rpc.createRound();
  } catch (error) {
    console.log("Error in  ", error)
  }
});

router.get('/winner/', function(req, res, next) {
  const determineWinner = () => {
    let winner;
    let otherWinners = [];
    hands.forEach((hand) => {
      const playerRank = getPlayerHandRank(hand);
      if (!winner) {
        winner = hand;
        return;
      }
      const winnerRank = getPlayerHandRank(winner);
      
      if (playerRank > winnerRank) {
        winner = hand;
      } else if (playerRank === winnerRank) {
        otherWinners.push(player);
      }

    })
    return [winner, otherWinners].flat();
  };

  // Helper function to calculate the rank of the player's hand (for simplicity, let's just use the highest card rank)
  const getPlayerHandRank = (hand) => {
    const ranks = hand.map((card) => card.rank);
    const maxRank = Math.max(...ranks);
    return maxRank;
  };

  const result = determineWinner();

  deck = initializeDeck();

  hands = [];
  commonCards = [];
  res.send(result);
});


module.exports = router;
