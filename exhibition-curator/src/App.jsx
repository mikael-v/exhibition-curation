import "./App.css";
import axios from "axios";

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Artworks } from "./components/Artworks";
import { OneArtwork } from "./components/OneArtwork";
//import { Users } from "./components/UserSelect";
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

  function Users({ setUserId }) {
    const artworkApi = axios.create({
      baseURL:
        "https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api",
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      artworkApi.get(`/users`).then((result) => {
        console.log(result.data.users);
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
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="cursor-pointer text-lg text-blue-500 hover:underline"
              onClick={() => handleUserClick(user.id)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
