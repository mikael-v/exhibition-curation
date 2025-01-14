import { useState } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Artworks } from "./components/Artworks";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/api/artwork" element={<Artworks />} />
          <Route path="/api/artworks" element={<Artworks />} />
          <Route path="/" element={<Artworks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
