const TexasHoldem = require('poker-odds-calc').TexasHoldem;

class State {
  constructor() {
    this.initializeDeck();
  }

  initializeDeck = () => {
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
    
    this.hands = [];
    this.commonCards = [];
    this.deck = newDeck;

    return newDeck;
  };

  determineWinner = () => {
    const Table = new TexasHoldem();

    this.hands.forEach((hand) => {
      console.log('each hand', hand);
      card0 = hand.cards[0].pokerRank + hand.cards[0].pokerSuit[0];
      card1 = hand.cards[1].pokerRank + hand.cards[1].pokerSuit[0];
      Table.addPlayer([card0, card1]);
    });

    flop = joinCards(this.commonCards);
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

    this.hands.forEach((hand) => {
      if (hand.cardsShort === winner.getHand()) {
        winnerPublicKey = hand.player;
        hand.winner = true;
      }
    });

    console.log(`Board: ${Result.getBoard()}`);
    console.log(`Iterations: ${Result.getIterations()}`);
    console.log(`Time takes: ${Result.getTime()}ms`);
    this.initializeDeck();

    return winnerPublicKey;
  };

  dealCommon = (numCards) => {
    const cards = this.deal(numCards);
      
    this.commonCards.push(cards);
    this.commonCards = this.commonCards.flat();
    return this.commonCards;
  };

  deal = (numCards) => {
    if (this.deck.length < 4) {
      res.errored('Not enough cards in the deck!');
      return;
    }
  
    return this.deck.splice(0, numCards);
  }

  dealHand = (player) => {
    const cards = this.deal(2);
    const cardsShort = cards.map((card) => card.card).join('');
    const hand = {
      'player': player,
      'cards': cards,
      'cardsShort': cardsShort
      };
    this.hands.push(hand);
    console.log('hands', this.hands);
    return hand;
  }

}
const GameState = new State();
module.exports = { GameState };