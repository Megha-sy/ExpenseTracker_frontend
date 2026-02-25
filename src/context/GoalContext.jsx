import React, { createContext, useEffect, useState } from "react";
import {
  fetchGoalsAPI,
  addGoalAPI,
  updateGoalAPI,
  deleteGoalAPI,
  togglePriorityAPI
} from "../api/api";
import { useNavigate } from "react-router-dom";

export const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [priorityGoals, setPriorityGoals] = useState([]);
  const navigate = useNavigate();

  // Secure Wrapper
  const safeCall = async (fn, ...params) => {
    try {
      return await fn(...params);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
      throw err;
    }
  };

  // Load goals
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await safeCall(fetchGoalsAPI);
      setGoals(data);
      setPriorityGoals(data.filter((g) => g.isPriority));
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  // Add goal
  const addGoalHandler = async (goalData) => {
    try {
      const newGoal = await safeCall(addGoalAPI, goalData);
      setGoals((prev) => [...prev, newGoal]);

      if (newGoal.isPriority) {
        setPriorityGoals((prev) => [...prev, newGoal]);
      }
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  // Toggle completion
  const toggleGoalCompletion = async (id) => {
    try {
      const goal = goals.find((g) => g._id === id);
      if (!goal) return;

      const updated = await safeCall(updateGoalAPI, id, {
        completed: !goal.completed,
      });

      const updatedGoals = goals.map((g) =>
        g._id === id ? updated : g
      );

      setGoals(updatedGoals);
      setPriorityGoals(updatedGoals.filter((g) => g.isPriority));
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  // Priority toggle
  const togglePriority = async (goal) => {
    try {
      const updated = await safeCall(togglePriorityAPI, goal._id);

      const updatedGoals = goals.map((g) =>
        g._id === goal._id ? updated : g
      );

      setGoals(updatedGoals);
      setPriorityGoals(updatedGoals.filter((g) => g.isPriority));
    } catch (err) {
      console.error("Error toggling priority:", err);
    }
  };

  const addPriorityGoal = togglePriority;
  const removePriorityGoal = togglePriority;

  // Delete goal
  const deleteGoalHandler = async (id) => {
    try {
      await safeCall(deleteGoalAPI, id);

      const filtered = goals.filter((g) => g._id !== id);
      setGoals(filtered);
      setPriorityGoals(filtered.filter((g) => g.isPriority));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  // Update goal
  const updateGoalHandler = async (id, updatedData) => {
    try {
      const updated = await safeCall(updateGoalAPI, id, updatedData);

      const updatedGoals = goals.map((g) =>
        g._id === id ? updated : g
      );

      setGoals(updatedGoals);
      setPriorityGoals(updatedGoals.filter((g) => g.isPriority));
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        priorityGoals,
        addGoal: addGoalHandler,
        toggleGoalCompletion,
        addPriorityGoal,
        removePriorityGoal,
        deleteGoal: deleteGoalHandler,
        updateGoal: updateGoalHandler,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
