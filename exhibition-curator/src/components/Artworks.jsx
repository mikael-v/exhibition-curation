import axios from "axios";
import React, { useEffect, useState } from "react";

const artworkApi = axios.create({
  baseURL: "https://ec-be-4-git-main-mikael-vs-projects.vercel.app/api",
});

export function Artworks() {
  const [artworks, setArtworks] = useState([]);
  useEffect(() => {
    artworkApi.get("/artwork").then((result) => {
      setArtworks(result.data.records);
    });
  }, []);



  return (
    <>
      <ul id="all-artworks">
        {artworks.map((artwork) => (
          <li key={artwork.id || artwork.systemNumber}>
            <h2>{artwork.title}</h2>
            <h3>{artwork.creators?.[0].description || "author"} </h3>
            <img src={`${artwork.images?.web.url}`} alt="artwork image" />
          </li>
        ))}
      </ul>
    </>
  );
}
