import axios from "axios";
import React, { useEffect, useState } from "react";

const artworkApi = axios.create({
  baseURL: "https://ec-be-4-git-main-mikael-vs-projects.vercel.app/api",
});

export function Artworks() {
  const [artworks, setArtworks] = useState([]);
  useEffect(() => {
    artworkApi.get("/artwork").then((result) => {
      console.log(result.data, " <<result data");
      //   setArtworks(result.data.articles);
    });
  }, []);

  return <></>;
}
