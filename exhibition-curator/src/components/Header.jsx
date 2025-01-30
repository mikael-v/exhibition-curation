import { Link, useNavigate } from "react-router-dom";

export function Header({ userId, hideCollectionsButton }) {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md dark:bg-gray-800 mb-8">
      <div className="container mx-auto px-6 text-center">
        {userId ? (
          <Link to="/artwork">
            <h1 className="text-3xl font-bold tracking-wide mb-10">
              Exhibition Curation
            </h1>
          </Link>
        ) : (
          <h1 className="text-3xl font-bold tracking-wide mb-10">
            Exhibition Curation
          </h1>
        )}
      </div>
      {!hideCollectionsButton && userId && (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate(`/users/${userId}/collections`)}
        >
          View Collections
        </button>
      )}
    </header>
  );
}
