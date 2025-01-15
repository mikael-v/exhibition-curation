import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const artworkApi = axios.create({
  baseURL:
    "https://exhibition-curator-be-git-main-mikael-vs-projects.vercel.app/api",
});

export function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [sortBy, setSortBy] = useState("title");
  const artworksPerPage = 10;

  useEffect(() => {
    console.log(`Fetching data for page: ${currentPage}`);

    artworkApi
      .get(
        `/artwork?page=${currentPage}&limit=${artworksPerPage}&sortBy=${sortBy}`
      )
      .then((result) => {
        console.log("API response:", result.data);

        setArtworks(result.data.records);
        setTotalPages(result.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching artworks:", error);
        setLoading(false);
      });
  }, [currentPage, sortBy]);

  const paginate = (pageNumber) => {
    console.log("Changing to page:", pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  if (loading) {
    return <div>Loading artworks...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border rounded"
        >
          <option value="title">Sort by Title</option>
          <option value="artist">Sort by Artist</option>
        </select>
      </div>
      <ul id="all-artworks">
        {artworks.map((artwork) => (
          <Link
            to={`/artwork/${artwork.id || artwork.systemNumber}`}
            key={artwork.id || artwork.systemNumber}
          >
            <li key={artwork.id || artwork.systemNumber}>
              <h2>{artwork.title || artwork._primaryTitle || "Untitled"}</h2>
              <h3>
                {artwork.creators?.[0]?.description ||
                  artwork._primaryMaker?.name ||
                  artwork.artist ||
                  artwork.records?.artistMakerOrganisations?.[0].name?.text ||
                  "Unknown"}
              </h3>
              <img
                src={
                  artwork.images?.web?.url ||
                  artwork.img_url ||
                  artwork._images._primary_thumbnail ||
                  "placeholder.jpg"
                }
                alt="artwork image"
              />
            </li>
          </Link>
        ))}
      </ul>

      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          className={`px-4 py-2 border rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          className="px-4 py-2 border rounded bg-blue-500 text-white"
          disabled
        >
          {currentPage}
        </button>

        <button
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
