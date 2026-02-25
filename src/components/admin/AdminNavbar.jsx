import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <div className="text-xl font-bold tracking-wide">
        Admin Panel
      </div>

      {/* Nav Links */}
      <div className="flex gap-8 items-center">
        <Link to="/admin" className="hover:text-blue-400 transition">
          Dashboard
        </Link>

        <Link to="/admin/users" className="hover:text-blue-400 transition">
          Users
        </Link>

       <Link to="/admin/budgets" className="hover:text-blue-400 transition">
          Budgets
        </Link>

        <Link to="/admin/goals" className="hover:text-blue-400 transition">
          Goals
        </Link>
         <Link to="/admin/transactions" className="hover:text-blue-400 transition">
          Transactions
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
