import "./App.css";
import axios from "axios";

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Artworks } from "./components/Artworks";
import { OneArtwork } from "./components/OneArtwork";
import { Collections } from "./components/Collections";
import { OneCollection } from "./components/OneCollection";

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
                <Header userId={userId} />
                <BackToArtButton />
                <Collections />
              </>
            }
          />
          <Route
            path="/users/:userId/collections/:collection"
            element={
              <>
                <Header userId={userId} />
                <OneCollection userId={userId} />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );

  function BackToArtButton({ userId }) {
    const navigate = useNavigate();

    const handleBackClick = () => {
      if (userId) {
        navigate(`/artwork?userId=${userId}`);
      } else {
        navigate("/artwork");
      }
    };

    return (
      <button
        onClick={handleBackClick}
        className="px-4 py-2 m-10 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
      >
        Back to Art
      </button>
    );
  }

  function Users({ setUserId }) {
    const artworkApi = axios.create({
      baseURL: "https://exhibition-curator-be.vercel.app/api",
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      artworkApi.get(`/users`).then((result) => {
        setUsers(result.data.users);
        setLoading(false);
      });
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen ">
          <h3 className="text-xl text-white-700">Loading Page...</h3>
        </div>
      );
    }

    const handleUserClick = (userId) => {
      setUserId(userId);
      navigate(`/artwork?userId=${userId}`);
    };

    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Select a User</h1>
        <div className="flex flex-wrap gap-2">
          {users.map((user) => (
            <span
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="cursor-pointer inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200 transition"
            >
              {user.name}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
