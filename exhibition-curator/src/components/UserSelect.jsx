import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const artworkApi = axios.create({
  baseURL:
    "https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api",
});

export function Users({ setUserId }) {
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
