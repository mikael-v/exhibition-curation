import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const artworkApi = axios.create({
  baseURL: "https://exhibition-curator-be.vercel.app/api",
});

export function Collections() {
  const { userId } = useParams();
  const [collections, setCollections] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    artworkApi
      .get(`/users/${userId}/collections`)
      .then((response) => {
        setCollections(response.data.collections || {});
        setUserName(response.data.username);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.msg || "Failed to fetch collections");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h3 className="text-xl text-gray-700">Loading Collections...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h3 className="text-xl text-red-700">{error}</h3>
      </div>
    );
  }

  if (Object.keys(collections).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h3 className="text-xl text-gray-700">No collections found</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-3xl font-bold mb-4">{userName}'s Collections</h1>
      <ul className="space-y-4">
        {Object.entries(collections).map(([name, artworks]) => (
          <li key={name} className="p-4 border rounded shadow-sm bg-white">
            <Link to={`/users/${userId}/collections/${name}`} className="block">
              <h2 className="text-xl bg-black font-semibold">{name}</h2>
            </Link>
            <p className="text-gray-600">
              {artworks.length} artwork(s) in this collection
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
