// client/src/Board.js
import React, { useState } from "react";
import minesweeper from "minesweeper";

const ROWS = 5;
const COLS = 5;
const MINES = 5;

export default function Board() {
  // Create mine array and board once
  const createBoard = () => {
    const mineArray = minesweeper.generateMineArray({
      rows: ROWS,
      cols: COLS,
      mines: MINES,
    });
    return new minesweeper.Board(mineArray);
  };

  const [board, setBoard] = useState(createBoard());

  // Grid state for React re-render
  const [grid, setGrid] = useState(board.grid().map((row) => [...row]));
  const [firstClick, setFirstClick] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winOver, setWinOver] = useState(false);

  const reveal = (r, c) => {
    if (firstClick) {
      setFirstClick(false);

      // If first click is a mine, swap it with a non-mine
      const cell = grid[r][c];
      if (cell.isMine) {
        // find a safe cell to move the mine to
        outer: for (let row of grid) {
          for (let other of row) {
            if (!other.isMine && other !== cell) {
              // swap
              other.isMine = true;
              cell.isMine = false;
              break outer;
            }
          }
        }

        // recalc numAdjacentMines manually
        recalcAdjacents(grid);
      }
    }
    board.openCell(c, r);
    setGrid(board.grid().map((row) => [...row])); // update React state
    console.log(board.state());

    // check if player clicked a bomb
    if (board.state() === minesweeper.BoardStateEnum.LOST) {
      // show popup
      setGameOver(true);
    }

    // optional: check if player won
    if (checkWin(board.grid())) {
      setWinOver(true);
    }
  };

  // Right click: cycle flag
  const flagCell = (e, r, c) => {
    e.preventDefault(); // prevent context menu

    const cell = grid[r][c];
    if (cell.state === minesweeper.CellStateEnum.OPEN) return; // can't flag opened cells

    // toggle between NONE and EXCLAMATION
    cell.flag =
      cell.flag === minesweeper.CellFlagEnum.EXCLAMATION
        ? minesweeper.CellFlagEnum.NONE
        : minesweeper.CellFlagEnum.EXCLAMATION;
    setGrid(board.grid().map((row) => [...row]));
  };

  const restartGame = () => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setGrid(newBoard.grid().map((row) => [...row]));
    setFirstClick(true);
    setGameOver(false);
    setWinOver(false);
  };

  const checkWin = (grid) => {
    for (let row of grid) {
      for (let cell of row) {
        // if there’s a non-mine cell still closed, not yet won
        if (!cell.isMine && cell.state === minesweeper.CellStateEnum.CLOSED) {
          return false;
        }
      }
    }
    return true; // all non-mine cells are opened
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 40px)`,
        justifyContent: "center",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          let text = "";
          let textColor = "black"; // default

          if (cell.state === minesweeper.CellStateEnum.OPEN) {
            if (cell.isMine) text = "💣";
            else if (cell.numAdjacentMines > 0) {
              text = cell.numAdjacentMines;

              // set color based on number
              switch (cell.numAdjacentMines) {
                case 1:
                  textColor = "blue";
                  break;
                case 2:
                  textColor = "green";
                  break;
                case 3:
                  textColor = "red";
                  break;
                case 4:
                  textColor = "purple";
                  break;
                case 5:
                  textColor = "maroon";
                  break;
                case 6:
                  textColor = "teal";
                  break;
                case 7:
                  textColor = "black";
                  break;
                case 8:
                  textColor = "gray";
                  break;
                default:
                  textColor = "black";
              }
            }
          } else if (cell.state === minesweeper.CellStateEnum.CLOSED) {
            if (cell.flag === minesweeper.CellFlagEnum.EXCLAMATION) text = "🚩";
          }

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => reveal(r, c)}
              onContextMenu={(e) => flagCell(e, r, c)}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  cell.state === minesweeper.CellStateEnum.OPEN
                    ? (r + c) % 2 === 0
                      ? "#e5c29f" // tan
                      : "#d7b899" // light grey
                    : (r + c) % 2 === 0
                      ? "#aad751" // lighter green
                      : "#a2d149", // darker green
                fontWeight: "bold",
                cursor: "pointer",
                userSelect: "none",
                color: textColor,
                fontSize: 22,
              }}
            >
              {text}
            </div>
          );
        }),
      )}
      {/* Game Over Modal */}
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px 50px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h1>Game Over!</h1>
            <button
              onClick={restartGame}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
      {/* Game Over Modal */}
      {winOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px 50px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h1>You Win!</h1>
            <button
              onClick={restartGame}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// helper function to recalc adjacent mines for all cells
function recalcAdjacents(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let count = 0;
      for (let [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (grid[nr][nc].isMine) count++;
        }
      }
      grid[r][c].numAdjacentMines = count;
    }
  }
}
