import React, { useState, useEffect } from "react";
import TransactionList from "./TransactionList";
import { getTransactions, createTransaction, getCategories } from "../../api/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ for dropdown
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    screenshot: null,
  });

  const navigate = useNavigate();

  // ✅ Load transactions + categories
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await createTransaction(data);
      setFormData({
        title: "",
        amount: "",
        category: "",
        type: "expense",
        screenshot: null,
      });
      fetchTransactions();
      alert("✅ Transaction added successfully!");
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction.");
    }
  };

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">💰 Manage Transactions</h1>

        {/* 🗂️ Manage Categories Button */}
        <button
          onClick={() => navigate("/categories")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          🗂️ Manage Categories
        </button>
      </div>

      {/* Add Transaction Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-6 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />

        {/* ✅ Category Dropdown */}
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border p-3 rounded-lg"
          required
        >
          <option value="">Select Category</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))
          ) : (
            <option disabled>No categories found</option>
          )}
        </select>

        {/* Transaction Type */}
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="border p-3 rounded-lg"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* Screenshot Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, screenshot: e.target.files[0] })}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition"
        >
          ➕ Add
        </button>
      </motion.form>

      {/* Transaction List */}
      <TransactionList transactions={transactions} refresh={fetchTransactions} />
    </div>
  );
};

export default Transactions;
