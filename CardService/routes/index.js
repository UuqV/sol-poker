var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

  return newDeck;
};

let deck = initializeDeck();

let hands = [];
let commonCards = [];


/* GET cards. */
router.get('/shuffle/', function(req, res, next) {
  
  deck = initializeDeck();

  hands = [];
  commonCards = [];
  
  res.send("Deck shuffled and hands reset");
});

/* GET cards. */
router.get('/hand/', function(req, res, next) {
  
    // Function to deal the initial two cards to the player and computer
    const dealInitialCards = () => {
      if (deck.length < 4) {
        res.errored('Not enough cards in the deck!');
        return;
      }
  
      const playerCards = deck.splice(0, 2);
      return {playerCards}
    };

  const cards = dealInitialCards();
  hands.push(cards);
  res.send(cards.flat());
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

module.exports = router;
