import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md dark:bg-gray-800 mb-8">
      <div className="container mx-auto px-6 text-center">
        <Link to="/artwork">
          <h1 className="text-3xl font-bold tracking-wide">
            Exhibition Curation
          </h1>
        </Link>
      </div>
    </header>
  );
}
