import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 transition">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          StackIt
        </Link>

        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium">
            Home
          </Link>

          {token && (
            <Link to="/ask" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium">
              Ask
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 font-medium">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          )}

          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}

