import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/api"; // ✅ IMPORT API

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("❌ New password and confirmation do not match!");
      return;
    }

    try {
      setLoading(true);

      // ✅ REAL API CALL
      await changePassword({
        currentPassword,
        newPassword,
      });

      alert("✅ Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/profile");
    } catch (err) {
      console.error("Change Password Error:", err);
      alert(err?.message || "❌ Current password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          🔒 Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "🔑 Change Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full mt-2 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
