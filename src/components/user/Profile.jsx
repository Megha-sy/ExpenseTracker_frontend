// src/components/user/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../api/api";

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);
    setName(parsed.name);
    setEmail(parsed.email);
  }, []);

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateProfile({ name, email });
      
      // Save updated user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        User Profile
      </h1>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://i.pravatar.cc/100"
              alt="user"
              className="w-24 h-24 rounded-full border-2 border-blue-400"
            />

            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-gray-600 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate("/change-password")}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
            >
              Change Password
            </button>

            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Save Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
