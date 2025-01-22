import "./App.css";

import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Artworks } from "./components/Artworks";
import { OneArtwork } from "./components/OneArtwork";
import { Users } from "./components/UserSelect";
import { Collections } from "./components/Collections";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Header hideCollectionsButton={true} />
                <Users setUserId={setUserId} />
              </>
            }
          />
          <Route
            exact
            path="/artwork/:artwork_id"
            element={
              <>
                <Header userId={userId} />
                <BackToArtButton />
                <OneArtwork userId={userId} />{" "}
              </>
            }
          />
          <Route
            path="/artwork"
            element={
              <>
                <Header userId={userId} />
                <Artworks userId={userId} />{" "}
              </>
            }
          />
          <Route
            path="/artworks"
            element={
              <>
                <Header userId={userId} />
                <Artworks userId={userId} />{" "}
              </>
            }
          />
          <Route
            path="/users/:userId/collections"
            element={
              <>
                <Header />
                <BackToArtButton />
                <Collections />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );

  function BackToArtButton() {
    const navigate = useNavigate();

    return (
      <button
        onClick={() => navigate("/artwork")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
      >
        Back to Art
      </button>
    );
  }
}

export default App;
