import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Protect admin routes
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <AdminNavbar />
      <div className="pt-5"> {/* pushes content below navbar */}
        <Outlet/>
      </div>
    </>
  );
};

export default AdminLayout;
