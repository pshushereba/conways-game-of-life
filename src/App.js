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

  // console.log("grid", grid);
  // console.log("updatedGrid", updatedGrid);

  // useEffect(() => {
  //   if (grid) {
  //   show grid
  //   } else {
  //   show updatedGrid
  //   }
  // }, [size]);

  useEffect(() => {
    createGrid(size);
  }, [size]);

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
    //console.log(grid);
  };

  const toggleGame = () => {
    setRunning(!running);
  };

  const clearBoard = () => {
    setRunning(false);
    createGrid(size);
  };

  const countActiveNeighbors = (currentGrid, i, j) => {
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
    for (let k = 0; i < directions.length; k++) {
      const dir = directions[i];
      let i1 = i + dir[1];
      let j1 = j + dir[0];
      console.log("Pair", i1, j1, currentGrid.length);
      console.log("i/j", i, j);
      if (
        i1 >= 0 &&
        i1 < currentGrid.length &&
        j1 >= 0 &&
        j1 < currentGrid.length
      ) {
        if (currentGrid[i1][j1] === 1) {
          neighbors += 1;
        }
      }
    }
    console.log(neighbors);
    return neighbors;
  };

  const generateNextGen = () => {
    // Figure out how to run through all of the cells.
    const points = [];

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        console.log(grid[i][j]);
        console.log(countActiveNeighbors(grid, i, j));
        if (
          countActiveNeighbors(grid, i, j) < 2 ||
          countActiveNeighbors(grid, i, j) > 3
        ) {
          updatedGrid[i][j] = 0;
          console.log("1", grid[i][j]);
          setUpdatedGrid(updatedGrid);
        } else {
          updatedGrid[i][j] = 1;
          console.log("2", grid[i][j]);
          setUpdatedGrid(updatedGrid);
        }
        if (
          countActiveNeighbors(grid, i, j) === 2 ||
          countActiveNeighbors(grid, i, j) === 3
        ) {
          updatedGrid[i][j] = 1;
          console.log("3", grid[i][j]);
          setUpdatedGrid(updatedGrid);
        }
        if (countActiveNeighbors(grid, i, j) === 3 && grid[i][j] === 0) {
          updatedGrid[i][j] = 1;
          console.log("4", grid[i][j]);
          setUpdatedGrid(updatedGrid);
        }
      }
    }
    console.log(updatedGrid);
    // countActiveNeighbors()
    // use result of countActiveNeighbors() to change the state of updatedGrid
    // if neighbors == 2 or neighbors == 3
    // points.push(i,j)
    // updateGrid with alive cell at this index
    // if neighbors > 3 or neighbors < 2
    // update grid with dead cell at this index
  };

  //console.log(generateNextGen());

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <h2>Generation:</h2>
      <div className="grid">
        {grid.map((row, i) => {
          return row.map((col, j) => {
            return (
              <canvas
                key={(i, j)}
                style={{
                  height: `${500 / size}px`,
                  width: `${500 / size}px`,
                }}
                className={col === 1 ? "alive" : "dead"}
                ref={canvasRef}
                // need to pass node location, (row, col) and a value to updateGrid so that I can update the correct node for the updated grid.
                onClick={() => toggleCell(i, j)}
              ></canvas>
            );
          });
        })}
      </div>
      <button onClick={() => createGrid(size)}>Start</button>
      <button onClick={() => generateNextGen()}>Next</button>
      <button onClick={() => clearBoard()}>Clear</button>
    </div>
  );
}

export default App;

// generate empty grid
// make each cell able to be toggled by the user
// when game runs:
// take the current state of the board, and calculate the neighbors for each of the active cells
// if a cell has two or three neighbors it survives to the next generation.
// if a cell has less than 2 neighbors, it dies.
// if a cell has more than 3 neighbors, it dies.
// use the current state of the board and the neighbors to determine which cells are alive or dead for the next generation.
