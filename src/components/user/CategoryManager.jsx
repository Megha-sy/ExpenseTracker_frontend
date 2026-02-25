import React, { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "../../api/api";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

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
    if (!categoryName.trim()) return alert("Please enter a category name.");

    try {
      await createCategory({ name: categoryName });
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🗂️ Manage Categories</h1>

      {/* Add Category Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border p-3 rounded-lg flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition"
        >
          ➕ Add
        </button>
      </form>

      {/* Category List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {categories.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Category Name</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{cat.name || "—"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No categories added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
