import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { logout } = useAuth();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-bold text-lg">
            E
          </div>
          <span className="text-xl font-bold text-gray-900">EduPress</span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Courses
          </Link>

        
          <Link
            to="/student-exams"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
           Exams
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          {isAdmin && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

