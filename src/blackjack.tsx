import React from "react";

type Card = {
  value:
    | "A"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K";
  suit: "hearts" | "diamonds" | "clubs" | "spades";
};

enum GameStatus {
  Idle = "idle",
  Playing = "Playing",
  PlayerBusted = "Player busted!",
  PlayerWon = "Player won!",
  DealerWon = "Dealer won!",
  Draw = "It's a draw!",
  Dealer = "dealer",
}

// Function to get card unicode character
const getCardUnicode = (card: Card): string => {
  const suitOffset = {
    hearts: 0x1f0b0,
    diamonds: 0x1f0c0,
    clubs: 0x1f0d0,
    spades: 0x1f0a0,
  };

  const valueOffset = {
    A: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 13,
    K: 14,
  };

  const cardOffset: number = suitOffset[card.suit] + valueOffset[card.value];
  const cardUnicode = String.fromCodePoint(cardOffset);

  return cardUnicode;
};

const asyncFunction = (t: number | undefined) =>
  new Promise<void>((resolve) => setTimeout(resolve, t));

// Blackjack component
const Blackjack: React.FC = () => {
  // game status string with the enum
  const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.Idle);
  // Add your game logic and components here
  // State for the deck of cards
  const [deck, setDeck] = React.useState<Card[]>([]);

  // State for the player's hand
  const [playerHand, setPlayerHand] = React.useState<Card[]>([]);

  // State for the dealer's hand
  const [dealerHand, setDealerHand] = React.useState<Card[]>([]);

  // Function to shuffle the deck
  const shuffleDeck = async () => {
    // Shuffle the deck logic
    // Create an array of all possible card values and suits
    const suits: ("hearts" | "diamonds" | "clubs" | "spades")[] = [
      "hearts",
      "diamonds",
      "clubs",
      "spades",
    ];
    const values: (
      | "A"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
      | "J"
      | "Q"
      | "K"
    )[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    // Create a new deck of cards
    const newDeck = suits.flatMap((suit) =>
      values.map((value) => ({ value, suit }))
    );

    // Shuffle the new deck using Fisher-Yates algorithm
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    // Return the shuffled deck
    return newDeck;
  };

  // Function to deal initial cards
  const dealInitialCards = async () => {
    const shuffledDeck = await shuffleDeck();
    // Update the deck state with the shuffled deck
    setDeck(shuffledDeck);

    // Deal initial cards logic
    // Draw two cards for the player and two cards for the dealer
    const playerCards = [shuffledDeck.pop(), shuffledDeck.pop()].filter(
      (card) => card
    ) as Card[];
    const dealerCards = [shuffledDeck.pop(), shuffledDeck.pop()].filter(
      (card) => card
    ) as Card[];

    // Update the player's and dealer's hands
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);

    // Update the game status to "Playing"
    setGameStatus(GameStatus.Playing);
  };

  React.useEffect(() => {
    // Initialize the deck and deal initial cards when the component mounts
    shuffleDeck();
  }, []);

  // Function to calculate hand value
  const calculateHandValue = (hand: Card[]) => {
    // Calculate hand value logic
    // Initialize variables for hand value and aces count
    let handValue = 0;
    let acesCount = 0;

    // Iterate through the hand and calculate the value
    hand.forEach((card) => {
      if (card.value === "A") {
        acesCount++;
        handValue += 11;
      } else if (["K", "Q", "J"].includes(card.value)) {
        handValue += 10;
      } else {
        handValue += parseInt(card.value);
      }
    });

    // Adjust the hand value for aces if it's over 21
    while (handValue > 21 && acesCount > 0) {
      handValue -= 10;
      acesCount--;
    }

    return handValue;
  };

  // Function to calculate hand display value with Ace, taking into account if the dealer has a hidden card
  const calculateHandDisplayValue = (
    hand: Card[],
    isDealer: boolean = false
  ): string => {
    const handValue = calculateHandValue(hand);
    const hasAce = hand.some((card) => card.value === "A");
    const lastCardIsAce = hand[hand.length - 1]?.value === "A";
    const initialCardsAreAces =
      hand.length < 3 && hand.slice(0, 2).every((card) => card.value === "A");
    const hiddenCard = isDealer && gameStatus === GameStatus.Playing;
    const displayValue =
      hasAce && (lastCardIsAce || initialCardsAreAces)
        ? `${handValue - 10} or ${handValue}`
        : `${handValue}`;
    return hiddenCard && lastCardIsAce
      ? "?"
      : hiddenCard
      ? `${displayValue.slice(0, -3)}?`
      : displayValue;
  };

  // Function to handle player's hit action
  const playerHit = () => {
    // Player hit logic
    // Draw a card from the deck for the player
    const newCard = deck.pop();

    // Add the new card to the player's hand
    const updatedPlayerHand = [...playerHand, newCard!];

    // Update the player's hand state with the updated hand
    setPlayerHand(updatedPlayerHand);

    // Check if the player's hand value is over 21 (bust)
    const playerHandValue = calculateHandValue(updatedPlayerHand);
    if (playerHandValue > 21) {
      // Update the game status to "Player busted!"
      setGameStatus(GameStatus.PlayerBusted);
    }
  };

  // Function to determine the winner
  const determineWinner = (currentDealerHand: Card[]) => {
    // Determine winner logic
    const playerHandValue = calculateHandValue(playerHand);
    const dealerHandValue = calculateHandValue(currentDealerHand);

    if (playerHandValue > 21) {
      return GameStatus.DealerWon;
    } else if (dealerHandValue > 21) {
      return GameStatus.PlayerWon;
    } else if (playerHandValue > dealerHandValue) {
      return GameStatus.PlayerWon;
    } else if (playerHandValue < dealerHandValue) {
      return GameStatus.DealerWon;
    } else {
      return GameStatus.Draw;
    }
  };

  const playerStand = async () => {
    setGameStatus(GameStatus.Dealer);
    let dealerHandValue = calculateHandValue(dealerHand);
    let currentDealerHand = [...dealerHand];

    await asyncFunction(1000);

    const dealAndEval = async (
      resolve: () => void,
      reject: (reason?: any) => void
    ) => {
      if (dealerHandValue > 16) {
        return resolve();
      }
      const newCard = deck.pop();
      const updatedDealerHand = [...currentDealerHand, newCard!];
      currentDealerHand = updatedDealerHand;
      dealerHandValue = calculateHandValue(updatedDealerHand);
      setDealerHand(updatedDealerHand);

      if (dealerHandValue > 16) {
        return resolve();
      } else {
        await asyncFunction(1000);
        dealAndEval(resolve, reject);
      }
    };

    const runScript = async () => {
      await new Promise<void>((r, j) => dealAndEval(r, j));
      const winner = determineWinner(currentDealerHand);
      setGameStatus(winner);
    };

    runScript();
  };

  return (
    <div className="blackjack-container">
        <span className={`game-status ${gameStatus}`}>Game Status: {gameStatus}</span>
      <div className="buttons">
        {gameStatus === GameStatus.Idle ||
        gameStatus === GameStatus.PlayerWon ||
        gameStatus === GameStatus.DealerWon ||
        gameStatus === GameStatus.PlayerBusted ||
        gameStatus === GameStatus.Draw ? (
          <button onClick={dealInitialCards}>New Round</button>
        ) : (
          <>
            <button onClick={playerHit}>Hit</button>
            <button onClick={playerStand}>Stand</button>
          </>
        )}
      </div>

      <span>Player: ({calculateHandDisplayValue(playerHand, false)})</span>
      <div className="player-hand">
        <div className="cards">
          {playerHand.map((card, index) => {
            return (
              <div
                data-text={`${getCardUnicode(card)}`}
                className={`card ${card.suit} ${card.value}`}
                key={index}
              >
                {getCardUnicode(card)}
              </div>
            );
          })}
        </div>
      </div>
      <span>Dealer: ({calculateHandDisplayValue(dealerHand, true)})</span>
      <div className="dealer-hand">
        <div className="cards">
          {dealerHand.map((card, index) => {
            const cardUnicode =
              index === 0 && gameStatus === GameStatus.Playing
                ? "\u{1F0A0}"
                : getCardUnicode(card);
            return (
              <div
                data-text={`${cardUnicode}`}
                className={`card ${card.suit} ${card.value} ${
                  index === 0 && gameStatus === GameStatus.Playing && "hidden"
                }`}
                key={index}
              >
                {cardUnicode}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
