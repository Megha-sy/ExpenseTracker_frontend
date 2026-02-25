import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTransactionById, updateTransaction } from "../../api/api";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    screenshot: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch transaction by ID
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getTransactionById(id);
        setTransaction(data);
        setFormData({
          title: data.title || "",
          amount: data.amount || "",
          category: data.category || "",
          type: data.type || "expense",
          screenshot: null,
        });
        if (data.screenshot) {
          setPreview(`https://expensetracker-backend-1-urxk.onrender.com/uploads/${data.screenshot}`);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, navigate]);

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, screenshot: file });
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("amount", formData.amount);
      data.append("category", formData.category);
      data.append("type", formData.type);
      if (formData.screenshot) data.append("screenshot", formData.screenshot);

      await updateTransaction(id, data);
      alert("✅ Transaction updated successfully!");
      navigate("/transactions");
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-600 text-lg">
        Loading transaction details...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="pt-20 text-center text-red-500 text-lg">
        Transaction not found.
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          ✏️ Edit Transaction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Screenshot */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Screenshot
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md mb-2 border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/transaction-list")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
