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
  const artworksPerPage = 10;

  useEffect(() => {
    console.log(`Fetching data for page: ${currentPage}`);

    artworkApi
      .get(`/artwork?page=${currentPage}&limit=${artworksPerPage}`)
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
  }, [currentPage]);

  const paginate = (pageNumber) => {
    console.log("Changing to page:", pageNumber);
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading artworks...</div>;
  }

  return (
    <>
      <ul id="all-artworks">
        {artworks.map((artwork) => (
          <Link
            to={`/artwork/${artwork.id || artwork.systemNumber}`}
            key={artwork.id || artwork.systemNumber}
          >
            <li key={artwork.id || artwork.systemNumber}>
              <h2>{artwork.title || "Untitled"}</h2>
              <h3>
                {artwork.creators?.[0]?.description ||
                  artwork._primaryMaker?.name ||
                  artwork.artist ||
                  "Unknown"}
              </h3>
              <img
                src={
                  artwork.images?.web?.url ||
                  artwork.img_url ||
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

        {/* Next Button */}
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
