import React, { useState, useEffect } from 'react';

const PokerGame = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [pot, setPot] = useState(0);
  const [roundInProgress, setRoundInProgress] = useState(false);

  useEffect(() => {
    initializeDeck();
  }, []);

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
    setPot(pot + 10); // Increment the pot by 10 (you can adjust the bet amount as needed)
  };

  // Function to determine the winner based on hand strength
  const determineWinner = () => {
    // You can implement your own hand evaluation logic here
    // For simplicity, let's assume the player wins if they have a higher rank than the computer

    const playerRank = getPlayerHandRank();
    const computerRank = getComputerHandRank();

    if (playerRank > computerRank) {
      alert('Player wins!');
    } else if (playerRank < computerRank) {
      alert('Computer wins!');
    } else {
      alert('It\'s a tie!');
    }

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
    </div>
  );
};

export default PokerGame;
