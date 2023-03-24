import React from "react";

// Minesweeper component
const Minesweeper: React.FC = () => {
  const numRows = 16;
  const numCols = 16;

  // Add difficulty state
  const [difficulty, setDifficulty] = React.useState("easy");

  // Generate the game board
  const generateBoard = () => {
    // Set min and max mines depending on difficulty
    let minMines: number;
    let maxMines: number;
    switch (difficulty) {
      case "easy":
        minMines = Math.floor(numRows * numCols * 0.1);
        maxMines = Math.floor(numRows * numCols * 0.15);
        break;
      case "medium":
        minMines = Math.floor(numRows * numCols * 0.15);
        maxMines = Math.floor(numRows * numCols * 0.2);
        break;
      case "hard":
        minMines = Math.floor(numRows * numCols * 0.2);
        maxMines = Math.floor(numRows * numCols * 0.25);
        break;
      default:
        minMines = Math.floor(numRows * numCols * 0.12);
        maxMines = Math.floor(numRows * numCols * 0.17);
    }

    const totalMines = Math.floor(Math.random() * (maxMines - minMines + 1)) + minMines;

    const board = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
      }))
    );

    // Randomly place mines on the board
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
      const row = Math.floor(Math.random() * numRows);
      const col = Math.floor(Math.random() * numCols);

      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }

    return board;
  };

  const [board, setBoard] = React.useState(generateBoard());

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Implement your click handling logic here
    // Check if the clicked cell is already revealed or flagged
    if (
      board[rowIndex][colIndex].isRevealed ||
      board[rowIndex][colIndex].isFlagged
    ) {
      return;
    }

    // Create a new board to update the state
    const newBoard = JSON.parse(JSON.stringify(board));

    // If the clicked cell is a mine, reveal all mines and end the game
    if (newBoard[rowIndex][colIndex].isMine) {
      newBoard.forEach((row: any) =>
        row.forEach((cell: any) => {
          if (cell.isMine) {
            cell.isRevealed = true;
          }
        })
      );
    } else {
      // Reveal the clicked cell and its neighbors if it's not a mine
      const revealNeighbors = (row: number, col: number) => {
        if (
          row >= 0 &&
          row < numRows &&
          col >= 0 &&
          col < numCols &&
          !newBoard[row][col].isRevealed &&
          !newBoard[row][col].isFlagged
        ) {
          newBoard[row][col].isRevealed = true;

          // If the current cell has no neighboring mines, reveal its neighbors recursively
          const neighbors = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ];

          const neighboringMines = neighbors.reduce(
            (count, [rOffset, cOffset]) =>
              row + rOffset >= 0 &&
              row + rOffset < numRows &&
              col + cOffset >= 0 &&
              col + cOffset < numCols &&
              newBoard[row + rOffset][col + cOffset].isMine
                ? count + 1
                : count,
            0
          );

          if (neighboringMines === 0) {
            neighbors.forEach(([rOffset, cOffset]) =>
              revealNeighbors(row + rOffset, col + cOffset)
            );
          }
        }
      };

      revealNeighbors(rowIndex, colIndex);
    }

    // Update the board state
    setBoard(newBoard);
    // Check if the player has won by revealing all non-mine cells
    const hasWon = newBoard.every((row: any) =>
      row.every((cell: any) => cell.isMine || cell.isRevealed)
    );

    if (hasWon) {
      // Reveal all mines and set their background color to green
      newBoard.forEach((row: any) =>
        row.forEach((cell: any) => {
          if (cell.isMine) {
            cell.isRevealed = true;
            cell.backgroundColor = "green";
          }
        })
      );
      // Display a winning message or perform any other winning actions here
    }
  };

  // Handle right click to toggle flag on cell
  const handleRightClick = (
    event: React.MouseEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    event.preventDefault();

    // Check if the clicked cell is already revealed
    if (board[rowIndex][colIndex].isRevealed) {
      return;
    }

    // Create a new board to update the state
    const newBoard = JSON.parse(JSON.stringify(board));

    // Toggle the flag on the clicked cell
    newBoard[rowIndex][colIndex].isFlagged =
      !newBoard[rowIndex][colIndex].isFlagged;

    // Update the board state
    setBoard(newBoard);
  };

  // Render the game board with numbers and mines
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: "flex" }}>
        {row.map((cell, colIndex) => {
          const neighboringMines = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ].reduce(
            (count, [rOffset, cOffset]) =>
              rowIndex + rOffset >= 0 &&
              rowIndex + rOffset < numRows &&
              colIndex + cOffset >= 0 &&
              colIndex + cOffset < numCols &&
              board[rowIndex + rOffset][colIndex + cOffset].isMine
                ? count + 1
                : count,
            0
          );
          return (
            <div
              className={`minesweeper-tile ${
                cell.isRevealed
                  ? cell.isMine
                    ? "mine"
                    : "clear"
                  : "unrevealed"
              }`}
              key={colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(event) =>
                handleRightClick(event, rowIndex, colIndex)
              }
            >
              {cell.isRevealed && !cell.isMine && neighboringMines > 0
                ? neighboringMines
                : cell.isRevealed && cell.isMine
                ? "💣"
                : cell.isFlagged
                ? "🚩"
                : ""}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="minesweeper-container">
      <button onClick={() => setBoard(generateBoard())}>Reset Game</button>
      <select
        className="minesweeper-difficulty"
        onChange={(event) => {
          setDifficulty(event.target.value);
            setBoard(generateBoard())
        }}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      {renderBoard()}
    </div>
  );
};

export default Minesweeper;
