import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1>Exhibition Curation</h1>
      <div className="card"></div>
    </>
  );
}

export default App;
