import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoalContext } from "../../context/GoalContext";

const Goals = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [savedInputs, setSavedInputs] = useState({});

  const {
    goals,
    addGoal,
    toggleGoalCompletion,
    priorityGoals,
    addPriorityGoal,
    deleteGoal,
    updateGoal,
  } = useContext(GoalContext);

  // --------------------------------------------------------------------
  // 🔐 AUTH CHECK - Redirect if not logged in
  // --------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access your goals.");
      navigate("/login");
      return;
    }
  }, [navigate]);

  // --------------------------------------------------------------------
  // 🔐 Secure wrapper for API calls (handles 401 automatically)
  // --------------------------------------------------------------------
  const safeExecute = async (fn, ...params) => {
    try {
      await fn(...params);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Goal operation error:", err);
        alert("Something went wrong!");
      }
    }
  };

  // --------------------------------------------------------------------
  // Initialize savedInputs whenever goals change
  // --------------------------------------------------------------------
  useEffect(() => {
    const initial = {};
    goals.forEach((g) => {
      initial[g._id] = g.saved || 0;
    });
    setSavedInputs(initial);
  }, [goals]);

  // --------------------------------------------------------------------
  // ➕ ADD GOAL
  // --------------------------------------------------------------------
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!name || !goalAmount) return;

    const newGoal = {
      name,
      goal: parseInt(goalAmount),
      saved: parseInt(savedAmount) || 0,
      percent: savedAmount
        ? Math.min(Math.round((savedAmount / goalAmount) * 100), 100)
        : 0,
      completed: false,
    };

    safeExecute(addGoal, newGoal);
    setName("");
    setGoalAmount("");
    setSavedAmount("");
  };

  // --------------------------------------------------------------------
  // Update input value for saved amount
  // --------------------------------------------------------------------
  const handleSavedChange = (id, value) => {
    setSavedInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // --------------------------------------------------------------------
  // Update saved amount in backend
  // --------------------------------------------------------------------
  const handleUpdateSaved = (g) => {
    const newSaved = parseInt(savedInputs[g._id]) || 0;
    const total = g.goal;
    const percent = Math.min(Math.round((newSaved / total) * 100), 100);

    const updatedGoal = {
      saved: newSaved,
      percent,
    };

    safeExecute(updateGoal, g._id, updatedGoal);
  };

  // --------------------------------------------------------------------
  // UI RETURN
  // --------------------------------------------------------------------
  return (
    <div className="pt-20 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Financial Goals 💰
      </h1>

      {/* ADD GOAL */}
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add a New Goal</h2>

        <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            type="number"
            placeholder="Goal Amount (₹)"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            type="number"
            placeholder="Saved (₹)"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            type="submit"
            className="md:col-span-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:scale-[1.02] transition-all font-semibold"
          >
            ➕ Add Goal
          </button>
        </form>
      </div>

      {/* PRIORITY BUTTON */}
      {priorityGoals?.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <button
            onClick={() => navigate("/priority-goals")}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-6 rounded-lg hover:scale-[1.03] transition font-medium"
          >
            🌟 View Priority Goals
          </button>
        </div>
      )}

      {/* GOALS LIST */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {goals.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No goals yet — Start planning your dreams ✨
          </p>
        ) : (
          goals.map((g) => (
            <div
              key={g._id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              {/* Title + Actions */}
              <div className="flex justify-between items-center mb-2">
                <p
                  className={`text-lg font-semibold ${
                    g.completed ? "line-through text-green-600" : "text-gray-800"
                  }`}
                >
                  {g.name}
                </p>

                <div className="flex gap-2">

                  {/* MARK DONE */}
                  <button
                    onClick={() => safeExecute(toggleGoalCompletion, g._id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      g.completed
                        ? "bg-gray-400 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {g.completed ? "Completed" : "Mark Done"}
                  </button>

                  {/* PRIORITY */}
                  {!g.completed && (
                    <button
                      onClick={() => safeExecute(addPriorityGoal, g)}
                      disabled={priorityGoals.some((pg) => pg._id === g._id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        priorityGoals.some((pg) => pg._id === g._id)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {priorityGoals.some((pg) => pg._id === g._id)
                        ? "Added"
                        : "Priority"}
                    </button>
                  )}

                  {/* DELETE */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete goal "${g.name}"?`)) {
                        safeExecute(deleteGoal, g._id);
                      }
                    }}
                    className="px-3 py-1 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                  >
                    ❌
                  </button>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${g.percent}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                {g.percent}% of ₹{g.goal} completed
              </p>

              {/* UPDATE SAVED AMOUNT */}
              {!g.completed && (
                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="number"
                    value={savedInputs[g._id] ?? 0}
                    onChange={(e) => handleSavedChange(g._id, e.target.value)}
                    className="border p-2 rounded-lg w-24 text-sm"
                  />
                  <button
                    onClick={() => handleUpdateSaved(g)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    Update Saved
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;
