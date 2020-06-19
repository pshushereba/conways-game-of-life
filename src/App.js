import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Set the default size of the grid.
  const [size, setSize] = useState(20);
  // Hold the initial empty grid in state.
  const [grid, setGrid] = useState([]);
  // Track whether the game is running or not.
  const [running, setRunning] = useState(false);

  console.log(grid);
  useEffect(() => {
    createGrid(size);
  }, [size]);

  const createGrid = (num) => {
    const newGrid = new Array(num).fill(null);
    newGrid.forEach((item, idx) => {
      newGrid[idx] = new Array(num).fill(null);
    });
    setGrid(newGrid);
    return newGrid;
  };

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <h2>Generation:</h2>
      <div className="grid">
        <canvas
          style={{
            height: `500px`,
            width: `500px`,
            backgroundColor: "#00b5ff",
          }}
        ></canvas>
      </div>
      <button>Play</button>
      <button>Pause</button>
      <button>Stop</button>
    </div>
  );
}

export default App;

// {grid.map((item) => {
//   return item.map((node) => {
//     return (
//       <canvas
//         style={{
//           height: `${500 / size}px`,
//           width: `${500 / size}px`,
//           backgroundColor: "#00b5ff",
//         }}
//       ></canvas>
//     );
//   });
// })}
