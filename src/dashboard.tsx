import React, { useState } from "react";
import RandomJoke from "./randomjoke";
import Tictac from "./tictactoe";
import HaddockQuotes from "./haddockquotes";
import WhackAMole from "./whackamole";
import Minesweeper from "./minesweeper";
import TVScreen from "./dvd";
import Blackjack from "./blackjack";
import Gameo from "./gameo";

const Dashboard: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState("");

  const handleGameSelection = (game: string) => {
    setSelectedGame(game);
  };

  const renderSelectedGame = () => {
    switch (selectedGame) {
      case "RandomJoke":
        return <RandomJoke />;
      case "Tictac":
        return <Tictac />;
      case "HaddockQuotes":
        return <HaddockQuotes />;
      case "WhackAMole":
        return <WhackAMole />;
      case "Minesweeper":
        return <Minesweeper />;
      case "TVScreen":
        return <TVScreen />;
      case "Blackjack":
        return <Blackjack />;
      case "Gameo":
        return <Gameo />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="game-selector-topbar">
        <button onClick={() => handleGameSelection("RandomJoke")}>
          Random Joke
        </button>
        <button onClick={() => handleGameSelection("Tictac")}>Tictac</button>
        <button onClick={() => handleGameSelection("HaddockQuotes")}>
          Haddock Quotes
        </button>
        <button onClick={() => handleGameSelection("WhackAMole")}>
          Whack A Mole
        </button>
        <button onClick={() => handleGameSelection("Minesweeper")}>
          Minesweeper
        </button>
        <button onClick={() => handleGameSelection("TVScreen")}>
          TV Screen
        </button>
        <button onClick={() => handleGameSelection("Blackjack")}>
          Blackjack
        </button>
        <button onClick={() => handleGameSelection("Gameo")}>Gameo</button>
      </div>
      <div className="game-container">{renderSelectedGame()}</div>
    </>
  );
};

export default Dashboard;
