// import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
// import { Program, AnchorProvider, web3, Wallet } from '@project-serum/anchor';
var web3 = require('@solana/web3.js');
var anchor = require('@project-serum/anchor');
var express = require('express');
const cors = require('cors');
var router = express.Router();
var IDL  = require("./idl");
const TexasHoldem = require('poker-odds-calc').TexasHoldem;


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
  console.log('provider',provider);
  return provider;

}

const getProgram = async () => {
  // Get metadata about your solana program
  console.log('programID',programID);
  // const idl = await Program.fetchIdl(programID, getProvider());

  // Create a program that you can call
  return new anchor.Program(IDL, programID, getProvider());
};

// Function to initialize the deck of cards
const initializeDeck = () => {
  // Create an array of cards
  const suits = ['♠', '♣', '♥', '♦'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const pokerSuits = ['s', 'c', 'h', 'd'];
  const pokerRanks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J','Q', 'K', 'A'];

  const newDeck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      newDeck.push({ 
        suit, 
        rank, 
        pokerSuit: pokerSuits[suits.indexOf(suit)], 
        pokerRank: pokerRanks[ranks.indexOf(rank)],
        card: pokerRanks[ranks.indexOf(rank)] + pokerSuits[suits.indexOf(suit)]
       });
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

const joinCards = (cards) => {
  return cards.map((card) => card.pokerRank + card.pokerSuit[0]);
}


/* GET cards. */
router.get('/shuffle/', function(req, res, next) {
  
  deck = initializeDeck();

  hands = [];
  commonCards = [];
  resJson = {
    deck: deck,
    hands: hands,
    commonCards: commonCards
  }
  console.log('After shuffle: ', resJson);
  res.send(resJson);
});


router.post('/hand/', function(req, res) {
  const {player} = req.body;
  console.log('calling /hand api, player: ', player);
    // Function to deal the initial two cards to the player and computer
  const dealInitialCards = () => {
    if (deck.length < 4) {
      res.errored('Not enough cards in the deck!');
      return;
    }

    const playerCards = deck.splice(0, 2);
    return playerCards;
  };

  const cards = dealInitialCards();
  cardsShort = cards.map((card) => card.card).join('');
  hands.push({
    'player': player,
    'cards': cards,
    'cardsShort': cardsShort
    });
  console.log('hands', hands);
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


router.get('/deck/', function(req, res, next) {
  res.send(deck);
});


router.get('/hands', function(req, res, next) {
  res.send(hands);
});


router.get('/common-cards', function(req, res, next) {
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
  console.log('commonCards', commonCards);
  res.send(commonCards);
});

router.get('/table/', async function (req, res, next) {
  
  try {
    // Connect to the Solana network
    const connection = new web3.Connection('https://api.devnet.solana.com');

    // Fetch the program account data
    const accountInfo = await connection.getAccountInfo(new web3.PublicKey("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU"));
    const program = await getProgram();
    console.log('program', program);
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
});


router.get('/winner/', function(req, res, next) {
  
  const determineWinner = () => {
    const Table = new TexasHoldem();

    hands.forEach((hand) => {
      console.log('each hand', hand);
      card0 = hand.cards[0].pokerRank + hand.cards[0].pokerSuit[0];
      card1 = hand.cards[1].pokerRank + hand.cards[1].pokerSuit[0];
      Table.addPlayer([card0, card1]);
    });

    flop = joinCards(commonCards);
    console.log('flop', flop);

    Table
      .setBoard(flop);

    const Result = Table.calculate();

    let winnerPercentage = -1;
    let winner;
    Result.getPlayers().forEach(player => {
      console.log('player.getWinsPercentage', player.getWinsPercentage());
      console.log(`${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`);
      if (player.getWinsPercentage() > winnerPercentage) {
        winnerPercentage = player.getWinsPercentage();
        winner = player;
      }
    });

    let winnerPublicKey;

    hands.forEach((hand) => {
      if (hand.cardsShort === winner.getHand()) {
        console.log('winner-key', hand.player);
        winnerPublicKey = hand.player;
        hand.winner = true;
        console.log(hand);
        console.log('winner', winner);
      }
    });

    console.log(`Board: ${Result.getBoard()}`);
    console.log(`Iterations: ${Result.getIterations()}`);
    console.log(`Time takes: ${Result.getTime()}ms`);
    deck = initializeDeck();

    hands = [];
    commonCards = [];
    res.send(winnerPublicKey);
  };

  const result = determineWinner();

  deck = initializeDeck();

  hands = [];
  commonCards = [];
  res.send(result);
});


module.exports = router;
