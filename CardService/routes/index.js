var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET cards. */
router.get('/cards/', function(req, res, next) {
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
  
    // Function to deal the initial two cards to the player and computer
    const dealInitialCards = () => {
      if (deck.length < 4) {
        alert('Not enough cards in the deck!');
        return;
      }
  
      const playerCards = deck.splice(0, 2);
      const computerCards = deck.splice(0, 2);
      return {playerCards, computerCards}
    };

  
  res.send(dealInitialCards());
});

module.exports = router;
