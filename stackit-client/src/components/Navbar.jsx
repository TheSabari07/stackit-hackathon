import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload(); 
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">StackIt</Link>

        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>

          {token && (
            <Link to="/ask" className="text-gray-700 hover:text-blue-600 font-medium">
              Ask
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
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
        </div>
      </div>
    </nav>
  );
}
