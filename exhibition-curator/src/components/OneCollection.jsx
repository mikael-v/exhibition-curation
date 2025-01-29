import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const artworkApi = axios.create({
  baseURL: "https://exhibition-curator-be.vercel.app/api",
});

export function OneCollection() {
  const { userId, collection } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionArtworks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: collectionData } = await artworkApi.get(
          `/users/${userId}/collections/${collection}`
        );

        const artworkIds = collectionData[collection] || [];

        const artworkPromises = artworkIds.map((artworkId) => {
          const normalizedArtworkId = artworkId.startsWith("O")
            ? artworkId
            : Number(artworkId);
          return artworkApi
            .get(`/artwork/${normalizedArtworkId}`)
            .then((res) => res.data);
        });
        const artworksData = await Promise.all(artworkPromises);
        setArtworks(artworksData);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
        setError("Failed to fetch artworks for the collection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollectionArtworks();
  }, [userId, collection]);

  const removeArtworkFromCollection = async (artworkId) => {
    try {
      await artworkApi.delete(`/users/${userId}/collections/${collection}`, {
        data: { artworkId },
      });

      setArtworks((prevArtworks) =>
        prevArtworks.filter((artwork) => artwork.id !== artworkId)
      );
    } catch (err) {
      console.error("Error removing artwork:", err);
      setError("Failed to remove artwork from the collection.");
    }
  };

  if (isLoading) {
    return <p>Loading artworks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!artworks.length) {
    return <p>No artworks found in this collection.</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{collection}</h2>
      <div className="grid grid-cols-2 gap-6">
        {artworks.map((artwork) => (
          <div
            key={artwork.id || artwork.systemNumber}
            className="block bg-black shadow-md rounded-lg overflow-hidden hover:shadow-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <Link
              to={`/artwork/${artwork.id || artwork.systemNumber}`}
              className="block"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white-800 dark:text-white">
                  {artwork.title || artwork._primaryTitle || "Untitled"}
                </h2>

                <h3 className="text-sm text-white-600 dark:text-gray-300 mt-1">
                  {artwork.creators?.[0]?.description ||
                    artwork._primaryMaker?.name ||
                    artwork.artist ||
                    artwork.records?.artistMakerOrganisations?.[0]?.name
                      ?.text ||
                    "Unknown"}
                </h3>
              </div>
              <img
                src={
                  artwork.images?.web?.url ||
                  artwork.img_url ||
                  artwork._images?._primary_thumbnail ||
                  "https://via.placeholder.com/300"
                }
                alt={artwork.title || "Artwork"}
                className="w-full h-64 object-cover mt-2"
              />
            </Link>
            <button
              onClick={() =>
                removeArtworkFromCollection(artwork.id || artwork.systemNumber)
              }
              className="px-4 py-2 bg-red-600 text-white rounded-b-lg hover:bg-red-800 w-full"
            >
              Remove From Collection
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
