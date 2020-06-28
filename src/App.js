import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // Set the default size of the grid.
  const [size, setSize] = useState(25);
  // Hold the initial empty grid in state.
  const [grid, setGrid] = useState([]);
  // Track whether the game is running or not.
  const [running, setRunning] = useState(false);
  // Track the population on the game board.
  const [population, setPopulation] = useState(0);
  // Hold the number of generations in state.
  const [generation, setGeneration] = useState(0);
  // useRef hook to use for canvas context.
  const canvasRef = useRef();
  // Track which of the animation frames is being displayed.
  const [offScreenBuffer, setOffScreenBuffer] = useState(null);
  // Hold the user's selected animation speed.
  // const [animationSpeed, setAnimationSpeed] = useState(0);

  // create an empty grid when app loads.
  useEffect(() => {
    createGrid(size);
  }, [size]);

  // When running changes to true, start the animation.
  useEffect(() => {
    if (running) {
      requestAnimationFrame(generateNextGen);
    }
  }, [running]);

  useEffect(() => {
    drawOffscreenBuffer();
  }, [grid]);

  const toggleRunning = () => {
    setRunning(!running);
  };

  // const setGameSpeed = (event) => {
  //   setAnimationSpeed(event.target.value);
  // };

  const createGrid = (num) => {
    const newGrid = new Array(num).fill(0);
    newGrid.forEach((item, idx) => {
      newGrid[idx] = new Array(num).fill(0);
    });
    setGrid(newGrid);
    // creating the offscreen buffer.
    let buffer = document.createElement("canvas");
    buffer.width = size * 25;
    buffer.height = size * 25;
    setOffScreenBuffer(buffer);
    return newGrid;
  };

  const randomGrid = () => {
    let duplicateGrid = [];
    for (let k = 0; k < size; k++) {
      duplicateGrid[k] = [...grid[k]];
    }
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (Math.random() < 0.4) {
          duplicateGrid[i][j] = 1;
        } else {
          duplicateGrid[i][j] = 0;
        }
      }
    }
    setGrid(duplicateGrid);
  };

  const toggleCell = (event) => {
    // check to see if the selected cell is alive or dead.
    // if alive, switch state and reduce population
    // else, toggle cell alive, increase population, and update grid.
    // Figure out the location of the cell that we are looking to toggle the state of.

    let i = Math.floor(
      ((event.pageX - canvasRef.current.offsetLeft) /
        canvasRef.current.offsetWidth) *
        size
    );
    let j = Math.floor(
      ((event.pageY - canvasRef.current.offsetTop) /
        canvasRef.current.offsetWidth) *
        size
    );

    let duplicateGrid = [];
    for (let k = 0; k < size; k++) {
      duplicateGrid[k] = [...grid[k]];
    }
    if (grid[i][j]) {
      duplicateGrid[i][j] = 0;
      setPopulation(population - 1);
    } else {
      duplicateGrid[i][j] = 1;
      setPopulation(population + 1);
    }
    setGrid(duplicateGrid);
    drawOffscreenBuffer(duplicateGrid);
  };

  const clearBoard = () => {
    setRunning(false);
    setGeneration(0);
    setSize(25);
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
    for (let k = 0; k <= directions.length - 1; k++) {
      const dir = directions[k];
      let i1 = i + dir[1];
      let j1 = j + dir[0];
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
    let duplicateGrid = [];
    for (let k = 0; k < size; k++) {
      duplicateGrid[k] = [...grid[k]];
    }
    let flag = true;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        const numNeighbors = countActiveNeighbors(grid, i, j);
        if (grid[i][j] === 1) {
          if (numNeighbors < 2 || numNeighbors > 3) {
            duplicateGrid[i][j] = 0;
          } else if (numNeighbors === 2 || numNeighbors === 3) {
            duplicateGrid[i][j] = 1;
            flag = false;
          }
        } else {
          if (numNeighbors === 3 && grid[i][j] === 0) {
            duplicateGrid[i][j] = 1;
            flag = false;
          }
        }
      }
    }

    if (flag) {
      setRunning(false);
    }

    setGrid(duplicateGrid);
    setGeneration(generation + 1);
  };

  const drawOffscreenBuffer = () => {
    if (!offScreenBuffer) {
      return;
    }
    // access primary context object.
    const context = offScreenBuffer.getContext("2d");
    // erase the previous image.
    context.fillStyle = "white";
    context.fillRect(0, 0, offScreenBuffer.width, offScreenBuffer.height);
    // reset color to black to draw new image.
    context.fillStyle = "black";
    for (let i = 0; i < size; i++) {
      // drawing the grid lines on the board
      context.fillRect(i * 25, 0, 1, offScreenBuffer.height);
      context.fillRect(0, i * 25, offScreenBuffer.width, 1);
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === 1) {
          // if the cell has been toggled alive, fill it in black.
          context.fillRect(i * 25, j * 25, 25, 25);
        }
      }
    }
    // accessing on screen context object
    const onScreenContext = canvasRef.current.getContext("2d");
    // drawing the off screen buffer to the on screen canvas.
    onScreenContext.drawImage(offScreenBuffer, 0, 0);
    // if the game is running, request the next generation
    if (running) {
      requestAnimationFrame(generateNextGen);
      // if (animationSpeed === 2000) {
      //   window.setTimeout(generateNextGen, animationSpeed);
      // } else if (animationSpeed === 1000) {
      //   window.setTimeout(generateNextGen, animationSpeed);
      // } else {
      //   requestAnimationFrame(generateNextGen);
      // }
    }
  };

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <h2>
        Generation:
        <span>{generation}</span>
      </h2>
      <div>
        <canvas
          className="grid"
          ref={canvasRef}
          onClick={toggleCell}
          width={size * 25}
          height={size * 25}
        />
      </div>
      <button onClick={() => toggleRunning()}>
        {running ? "Stop" : "Start"}
      </button>
      <button onClick={() => generateNextGen()}>Next</button>
      <button onClick={() => clearBoard()}>Clear</button>
      <button onClick={() => randomGrid()}>Random Grid</button>
      <button
        onClick={() => {
          setSize(30);
        }}
      >
        30
      </button>
      <button
        onClick={() => {
          setSize(40);
        }}
      >
        40
      </button>
      <button
        onClick={() => {
          setSize(50);
        }}
      >
        50
      </button>
      {/* <div>
        <select
          className="animation-speed"
          value={animationSpeed}
          onClick={setGameSpeed}
        >
          <option value={2000}>Slow</option>
          <option value={1000}>Normal</option>
          <option value={0}>Fast</option>
        </select>
      </div> */}
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
