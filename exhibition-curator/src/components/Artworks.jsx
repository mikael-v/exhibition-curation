import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const artworkApi = axios.create({
  baseURL: "https://exhibition-curator-be.vercel.app/api",
});

export function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [sortBy, setSortBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const artworksPerPage = 10;

  useEffect(() => {
    console.log(`Fetching data for page: ${currentPage}`);

    artworkApi
      .get(
        `/artwork?search=${searchQuery}&page=${currentPage}&limit=${artworksPerPage}&sortBy=${sortBy}`
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
  }, [currentPage, sortBy, searchQuery]);

  const paginate = (pageNumber) => {
    console.log("Changing to page:", pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <h3 className="text-xl text-white-700">Loading Page...</h3>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-white-600 dark:text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title or artist"
            className="w-1/2 px-4 py-2 w-80  border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500  dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="title">Sort by Title</option>
          <option value="artist">Sort by Artist</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {artworks.map((artwork) => (
          <Link
            to={`/artwork/${artwork.id || artwork.systemNumber}`}
            key={artwork.id || artwork.systemNumber}
            className="block bg-black shadow-md rounded-lg overflow-hidden hover:shadow-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white-800 dark:text-white">
                {artwork.title || artwork._primaryTitle || "Untitled"}
              </h2>

              <h3 className="text-sm text-white-600 dark:text-gray-300 mt-1">
                {artwork.creators?.[0]?.description ||
                  artwork._primaryMaker?.name ||
                  artwork.artist ||
                  artwork.records?.artistMakerOrganisations?.[0]?.name?.text ||
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
        ))}
      </div>

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
