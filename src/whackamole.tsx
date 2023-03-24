// Import necessary libraries
import React, { useState, useEffect } from "react";

// WhackAMole component
const WhackAMole: React.FC = () => {
  const [molePositions, setMolePositions] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [lastWhackedMole, setLastWhackedMole] = useState(-1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(60);

  // Highscore state and local storage handling
  const [highScore, setHighScore] = useState<number>(
    parseInt(localStorage.getItem("highScore") || "0")
  );

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setGameTime((prevTime) => {
          if (prevTime === 0) {
            resetGame();
            return gameTime;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameTime]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        const randomPosition = Math.floor(Math.random() * 9);
        const newMolePositions = Array(9).fill(false);
        newMolePositions[randomPosition] = true;
        setMolePositions(newMolePositions);
        setLastWhackedMole(-1);
        setTimeout(() => {
          const hideMolePositions = [...newMolePositions];
          hideMolePositions[randomPosition] = false;
          setMolePositions(hideMolePositions);
        }, 800);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted]);

  const handleButtonClick = (index: number) => {
    if (molePositions[index] && index !== lastWhackedMole) {
      setScore(score + 1);
      setLastWhackedMole(index);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setGameTime(60);
    setMolePositions(Array(9).fill(false));
  };

  return (
    <div className="whack-container">
      <p>Whack-a-Mole</p>
      <div className="score-container">
        <p>Score: {score}</p>
        <p>Highscore: {highScore}</p>
        <p>Time left: {gameTime}</p>
      </div>
      <div className="function-button-container">
        <button className="function-button" onClick={startGame}>
          Start Game
        </button>
        <button className="function-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {molePositions.map((isMole, index) => (
          <button
            className={`mole-button${isMole ? " has-mole" : ""}`}
            key={index}
            onClick={() => handleButtonClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default WhackAMole;
