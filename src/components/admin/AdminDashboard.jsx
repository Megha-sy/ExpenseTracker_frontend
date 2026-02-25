import React, { useEffect, useState } from "react";
import { fetchAdminSummary } from "../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchAdminSummary();
        setStats(data);
      } catch (err) {
        console.error("Admin summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <>

      {/* ✅ FULL WIDTH LAYOUT */}
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">

        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
          Admin Dashboard
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg animate-pulse">
            Loading admin data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* ✅ TOTAL USERS */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-lg mb-2">Total Users</h2>
              <p className="text-4xl font-bold text-blue-600">
                {stats.totalUsers}
              </p>
            </div>

            {/* ✅ TOTAL TRANSACTIONS */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-lg mb-2">
                Total Transactions
              </h2>
              <p className="text-4xl font-bold text-purple-600">
                {stats.totalTransactions}
              </p>
            </div>

            {/* ✅ TOTAL REVENUE */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-lg mb-2">
                Total Revenue
              </h2>
              <p className="text-4xl font-bold text-green-600">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
