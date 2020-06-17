import React, { useState } from "react";
import "./App.css";

function App() {
  // Set the default size of the grid.
  const [size, setSize] = useState(50);

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
