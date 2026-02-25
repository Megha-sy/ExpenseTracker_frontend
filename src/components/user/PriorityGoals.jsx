import React, { useContext } from "react";
import { GoalContext } from "../../context/GoalContext";
import { useNavigate } from "react-router-dom";

const PriorityGoals = () => {
  const { priorityGoals, removePriorityGoal } = useContext(GoalContext);
  const navigate = useNavigate();

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Priority Goals</h1>

        {/* 🔙 Back to Goals Button */}
        <button
          onClick={() => navigate("/goals")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Back to Goals
        </button>
      </div>

      {priorityGoals.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No priority goals yet. Add some from your Goals page.
        </p>
      ) : (
        <div className="space-y-4 max-w-lg mx-auto">
          {priorityGoals.map((g, i) => (
            <div
              key={i}
              className="bg-yellow-100 p-4 rounded-xl shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">{g.name}</p>
                <button
                  onClick={() => removePriorityGoal(g)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>

              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${g.percent || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {g.percent || 0}% of ₹{g.goal} completed
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityGoals;
