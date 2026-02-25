import React, { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Bell, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ GET CURRENT PATH

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ ✅ HIDE USER NAVBAR ON ADMIN ROUTES
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/transactions", label: "Transactions" },
    { path: "/budget", label: "Budget" },
    { path: "/reports", label: "Reports" },
  ];

  const linkClass =
    "relative px-4 py-2 text-gray-700 font-medium transition hover:text-blue-600";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md fixed w-full top-0 z-20 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
        >
          ExpenseTracker 💰
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "text-blue-600" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Notifications */}
          <Link to="/notifications" className="relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>

          {/* Profile Dropdown */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
              >
                <User size={18} />
                <span className="font-medium">{user?.name || "Account"}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow border-t">
          <div className="flex flex-col items-center space-y-3 py-4">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <>
                <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
