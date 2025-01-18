import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Artworks } from "./components/Artworks";
import { OneArtwork } from "./components/OneArtwork";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/artwork/:artwork_id" element={<OneArtwork />} />
          <Route path="/" element={<Artworks />} />
          <Route path="/artwork" element={<Artworks />} />
          <Route path="/artworks" element={<Artworks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
