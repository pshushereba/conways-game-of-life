import React, { useState } from "react";
import "./App.css";

function App() {
  // Set the default size of the grid.
  const [size, setSize] = useState(50);

  const createGrid = (num) => {
    const newGrid = new Array(num).fill(null);
    newGrid.forEach((item, idx) => {
      newGrid[idx] = new Array(num).fill(null);
    });
    return newGrid;
  };

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <h2>Generation:</h2>
      <button>Play</button>
      <button>Pause</button>
      <button>Stop</button>
    </div>
  );
}

export default App;
