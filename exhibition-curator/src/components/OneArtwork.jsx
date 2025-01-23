import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const artworkApi = axios.create({
  baseURL:
    "https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api",
});

export function OneArtwork({ userId }) {
  const { artwork_id } = useParams();
  const [artwork, setArtwork] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    setIsLoading(true);
    artworkApi
      .get(`/artwork/${artwork_id}`)
      .then((result) => {
        setIsLoading(false);
        setArtwork(result.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response?.data?.msg || "An error occurred");
      });
  }, [artwork_id]);

  useEffect(() => {
    if (userId) {
      artworkApi
        .get(`/users/${userId}/collections`)
        .then((result) => {
          setCollections(result.data.collections || {});
        })
        .catch((error) => {
          setError(error.response?.data?.msg || "Failed to load collections");
        });
    }
  }, [userId]);

  const handleAddToCollection = () => {
    const artworkId = String(artwork_id);

    if (collections[selectedCollection]) {
      axios
        .post(
          `https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api/users/${userId}/collections/${selectedCollection}`,

          { artworkId: artworkId }
        )
        .then(() => {
          console.log("Artwork added to collection successfully!");
        })
        .catch((error) => {
          console.error("Failed to add art to collection:", error);
        });
    } else if (newCollectionName) {
      artworkApi
        .post(`/users/${userId}/collections`, {
          collectionName: newCollectionName,
        })
        .then(() => {
          artworkApi
            .post(`/users/${userId}/collections/${newCollectionName}`, {
              artworkId: artworkId,
            })
            .then(() => {
              setSuccessMessage(
                "New collection created and artwork added successfully!"
              );
              setNewCollectionName("");
              setSelectedCollection("");
            })
            .catch((error) => {
              alert(
                error.response?.data?.msg ||
                  "Failed to add artwork to collection"
              );
            });
        })
        .catch((error) => {
          alert(error.response?.data?.msg || "Failed to create new collection");
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <h3 className="text-xl text-white-700">Loading Page...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-4 bg-black border rounded  h-contain ">
      <div className="mb-4">
        <h2 className="text-3xl font-semibold text-gray-300  dark:text-gray-100 ">
          {artwork.title || "Untitled"}
        </h2>
        <h3 className="text-lg text-gray-300 dark:text-gray-400 mb-6">
          By:{" "}
          {artwork.creators?.[0]?.description ||
            artwork._primaryMaker?.name ||
            artwork.artist ||
            "Unknown"}
        </h3>
      </div>

      <div className="flex">
        <div className="flex flex-wrap justify-between items-center">
          <img
            src={artwork.images?.web?.url || artwork.img_url}
            alt=""
            className="w-1/3 h-auto rounded-lg shadow-md object-contain"
          />
          <div className="w-2/3 pl-6">
            <p className=" mt-2text-gray-300 dark:text-gray-300">
              <span className="font-semibold">Techniques: </span>
              {Array.isArray(artwork.techniques)
                ? artwork.techniques.map((m) => m.text).join(", ")
                : artwork.techniques || "N/A"}
            </p>
            <p className="text-gray-300 dark:text-gray-300">
              <span className="font-semibold">Mediums: </span>
              {Array.isArray(artwork.medium)
                ? artwork.medium
                    .map((m) => (typeof m === "object" && m.text ? m.text : m))
                    .join(", ")
                : artwork.medium || "N/A"}
            </p>
            <p className="mt-4 text-gray-200">{artwork.summary}</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg text-gray-300 dark:text-gray-400 mb-4">
          Add to Collection:
        </h3>
        {collections && Object.keys(collections).length > 0 ? (
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="p-2 mb-4 bg-gray-800 text-white rounded"
          >
            <option value="">Select a collection</option>
            {Object.keys(collections).map((collectionName) => (
              <option key={collectionName} value={collectionName}>
                {collectionName}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-300 dark:text-gray-400 mb-4">
            You have no collections. Create one below.
          </p>
        )}
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name"
          className="p-2 mb-4 bg-gray-800 text-white rounded"
        />

        <button
          onClick={handleAddToCollection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add to Collection
        </button>
      </div>
    </div>
  );
}
