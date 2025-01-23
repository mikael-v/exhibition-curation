import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const artworkApi = axios.create({
  baseURL:
    "https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api",
});

export function OneCollection({ userId }) {
  const { collectionName } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionArtworks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: collectionData } = await artworkApi.get(
          `/users/${userId}/collections/${collectionName}`
        );

        const artworkIds = collectionData.collection || [];

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
  }, [userId, collectionName]);

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
    <div>
      <h2>Artworks in {collectionName}</h2>
      <ul>
        {artworks.map((artwork) => (
          <li key={artwork.id}>
            <h3>{artwork.title}</h3>
            <p>{artwork.description}</p>
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              style={{ maxWidth: "200px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
