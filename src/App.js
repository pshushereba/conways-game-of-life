import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // Set the default size of the grid.
  const [size, setSize] = useState(20);
  // Hold the initial empty grid in state.
  const [grid, setGrid] = useState([]);
  // Hold the updated grid in state.
  const [updatedGrid, setUpdatedGrid] = useState([]);
  // Track whether the game is running or not.
  const [running, setRunning] = useState(false);
  // Track the population on the game board.
  const [population, setPopulation] = useState(0);
  // Hold the number of generations in state.
  const [generation, setGeneration] = useState(0);
  // useRef hook to use for canvas context.
  const canvasRef = useRef();
  // Track which of the animation frames is being displayed.
  const [activeFrame, setActiveFrame] = useState(1);

  console.log("grid", grid);
  console.log("updatedGrid", updatedGrid);

  // What double buffer might look like:
  // if (activeFrame === 1) {
  //    setUpdatedGrid(generateNextGen())
  //    setActiveFrame(2);
  //} else {
  //    setGrid(generateNextGen());
  //    setActiveFrame(1);
  //}

  useEffect(() => {
    createGrid(size);
  }, [size]);

  // useEffect(() => {
  //   if (running) {
  //     requestAnimationFrame(generateNextGen);
  //   }
  // }, [running]);

  const createGrid = (num) => {
    const newGrid = new Array(num).fill(0);
    newGrid.forEach((item, idx) => {
      newGrid[idx] = new Array(num).fill(0);
    });
    setGrid(newGrid);
    setUpdatedGrid(newGrid);
    return newGrid;
  };

  const toggleCell = (i, j) => {
    const context = canvasRef.current.getContext("2d");
    // check to see if the selected cell is alive or dead.
    // if alive, switch state and reduce population
    // else, toggle cell alive, increase population, and update grid.
    if (grid[i][j]) {
      grid[i][j] = 0;
      setUpdatedGrid(grid);
      setPopulation(population - 1);
      context.fillStyle = "white";
    } else {
      grid[i][j] = 1;
      setPopulation(population + 1);
      setUpdatedGrid(grid);
    }
    setGrid(grid);
  };

  const toggleGame = () => {
    setRunning(!running);
  };

  const clearBoard = () => {
    setRunning(false);
    setSize(20);
    createGrid(size);
  };

  const countActiveNeighbors = (currentGrid, i, j) => {
    console.log(currentGrid);
    let neighbors = 0;
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
    // i = y / j = x
    for (let k = 0; k <= directions.length - 1; k++) {
      const dir = directions[k];

      let i1 = i + dir[1];
      let j1 = j + dir[0];
      console.log("Pair", i1, j1, currentGrid.length);
      console.log("i/j", i, j);
      if (
        i1 >= 0 &&
        i1 <= currentGrid.length - 1 &&
        j1 >= 0 &&
        j1 <= currentGrid.length - 1
      ) {
        if (currentGrid[i1][j1] === 1) {
          neighbors += 1;
        }
      }
    }
    return neighbors;
  };

  const generateNextGen = () => {
    // const testGrid = updatedGrid;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        const numNeighbors = countActiveNeighbors(grid, i, j);
        if (grid[i][j] === 1) {
          if (numNeighbors < 2 || numNeighbors > 3) {
            updatedGrid[i][j] = 0;
          } else if (numNeighbors === 2 || numNeighbors === 3) {
            updatedGrid[i][j] = 1;
          }
        } else {
          if (numNeighbors === 3 && grid[i][j] === 0) {
            updatedGrid[i][j] = 1;
          }
        }
      }
    }
    console.log(updatedGrid);
    setUpdatedGrid(updatedGrid);
    // updateGrid with alive cell at this index
    // if neighbors > 3 or neighbors < 2
    // update grid with dead cell at this index
    setGeneration(generation + 1);
  };

  //console.log(generateNextGen());

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <h2>Generation:</h2>
      <div className="grid">
        {/* {grid.map((row, i) => {
          return row.map((col, j) => {
            return (
              <canvas
                key={(i, j)}
                style={{
                  height: `${450 / size}px`,
                  width: `${450 / size}px`,
                  border: "1px solid black",
                }}
                className={col === 1 ? "alive" : "dead"}
                ref={canvasRef}
                onClick={() => toggleCell(i, j)}
              ></canvas>
            );
          });
        })} */}
        <canvas
          ref={canvasRef}
          onClick={toggleCell}
          width={size * 25 + "px"}
          height={size * 25 + "px"}
        />
      </div>
      <button onClick={() => createGrid(size)}>Start</button>
      <button onClick={() => generateNextGen()}>Next</button>
      <button onClick={() => clearBoard()}>Clear</button>
      <button
        onClick={() => {
          setSize(30);
          createGrid(size);
        }}
      >
        30
      </button>
      <button
        onClick={() => {
          setSize(40);
          createGrid(size);
        }}
      >
        40
      </button>
      <button
        onClick={() => {
          setSize(50);
          createGrid(size);
        }}
      >
        50
      </button>
      <div className="rules-container">
        <p>
          The universe of the Game of Life is an infinite, two-dimensional
          orthogonal grid of square cells, each of which is in one of two
          possible states, live or dead, (or populated and unpopulated,
          respectively). Every cell interacts with its eight neighbours, which
          are the cells that are horizontally, vertically, or diagonally
          adjacent. At each step in time, the following transitions occur:
        </p>
        <ul>
          <li>
            Any live cell with fewer than two live neighbours dies, as if by
            underpopulation.
          </li>
          <li>
            Any live cell with two or three live neighbours lives on to the next
            generation.
          </li>
          <li>
            Any live cell with more than three live neighbours dies, as if by
            overpopulation.
          </li>
          <li>
            Any dead cell with exactly three live neighbours becomes a live
            cell, as if by reproduction.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
