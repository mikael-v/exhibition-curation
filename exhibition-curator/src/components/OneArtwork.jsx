import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const artworkApi = axios.create({
  baseURL:
    "https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api",
});

export function OneArtwork() {
  const { artwork_id } = useParams();
  const [artwork, setArtwork] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    artworkApi
      .get(`/artwork/${artwork_id}`)
      .then((result) => {
        console.log(">>RES", result, "<<RES");
        setIsLoading(false);
        setArtwork(result.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response?.data?.msg || "An error occurred");
      });
  }, [artwork_id]);

  if (isLoading) {
    return (
      <>
        <h3>Loading Page...</h3>
      </>
    );
  }

  return (
    <>
      <h2>{artwork.title || "Untitled"}</h2>
      <h3>
        By:{" "}
        {artwork.creators?.[0]?.description ||
          artwork._primaryMaker?.name ||
          artwork.artist ||
          "Unknown"}
      </h3>
      <p>
        Techniques: {artwork.techniques?.map((m) => m.text).join(", ") || "N/A"}
      </p>
      <p>Mediums: {artwork.medium?.map((m) => m.text).join(", ") || "N/A"}</p>
      <img src={artwork.images?.web?.url || artwork.img_url} alt="" />
      <p>{artwork.summary}</p>
    </>
  );
}
