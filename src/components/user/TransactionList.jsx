import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, deleteTransaction } from "../../api/api";

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-transaction/${id}`);
  };

  // ✅ Apply filters
  const filteredTransactions = transactions.filter((t) => {
    const matchesDate = filterDate ? t.date?.slice(0, 10) === filterDate : true;
    const matchesSearch = search ? t.title.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesType = typeFilter !== "All" ? t.type === typeFilter.toLowerCase() : true;
    return matchesDate && matchesSearch && matchesType;
  });

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Transactions</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded-lg"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <button
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          onClick={() => {
            setFilterDate("");
            setSearch("");
            setTypeFilter("All");
          }}
        >
          Reset
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading your transactions...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4">Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Screenshot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t._id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{t.title}</td>
                    <td>{t.category}</td>
                    <td className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </td>
                    <td>₹{t.amount}</td>
                    <td>{t.date ? t.date.slice(0, 10) : "—"}</td>
                    <td>
                      {t.screenshot ? (
                        <img
                          src={`http://localhost:5000/uploads/${t.screenshot}`}
                          alt="Transaction Screenshot"
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="flex gap-2 py-2 px-4">
                      <button
                        onClick={() => handleEdit(t._id)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
