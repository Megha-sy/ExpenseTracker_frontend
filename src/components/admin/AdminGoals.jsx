import React, { useEffect, useState } from "react";
import { getAllGoalsAdmin } from "../../api/api";

const AdminGoals = () => {
  const [data, setData] = useState([]);

  // ✅ FILTER STATES
  const [searchGoal, setSearchGoal] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [minProgress, setMinProgress] = useState("");

  useEffect(() => {
    getAllGoalsAdmin().then(setData);
  }, []);

  // ✅ EXTRACT UNIQUE USERS FOR DROPDOWN
  const uniqueUsers = [
    ...new Map(
      data
        .filter((g) => g.user)
        .map((g) => [g.user._id, g.user])
    ).values(),
  ];

  // ✅ FILTER LOGIC
  const filteredGoals = data.filter((g) => {
    const progress = (g.saved / g.goal) * 100;

    return (
      g.name.toLowerCase().includes(searchGoal.toLowerCase()) &&
      (selectedUser === "" || g.user?._id === selectedUser) &&
      (minProgress === "" || progress >= Number(minProgress))
    );
  });

  return (
    <div className="pt-14 px-6 bg-gray-100 min-h-screen">

      {/* ✅ HEADER */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Goals</h2>

      {/* ✅ FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ✅ GOAL NAME FILTER */}
        <input
          type="text"
          placeholder="Search by Goal Name"
          className="border p-2 rounded"
          value={searchGoal}
          onChange={(e) => setSearchGoal(e.target.value)}
        />

        {/* ✅ USER DROPDOWN FILTER */}
        <select
          className="border p-2 rounded"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">All Users</option>
          {uniqueUsers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* ✅ MIN PROGRESS FILTER */}
        <input
          type="number"
          placeholder="Min Progress %"
          className="border p-2 rounded"
          value={minProgress}
          onChange={(e) => setMinProgress(e.target.value)}
        />
      </div>

      {/* ✅ GOAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((g) => {
          const progress = Math.min(
            Math.round((g.saved / g.goal) * 100),
            100
          );

          return (
            <div
              key={g._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  {g.name}
                </h4>
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {progress}%
                </span>
              </div>

              <p className="text-gray-500 mb-2">
                User: <span className="font-medium">{g.user?.name}</span>
              </p>

              {/* ✅ Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full mb-3">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Target: ₹{g.goal}</span>
                <span>Saved: ₹{g.saved}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ NO RESULTS MESSAGE */}
      {filteredGoals.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No matching goals found.
        </p>
      )}
    </div>
  );
};

export default AdminGoals;
