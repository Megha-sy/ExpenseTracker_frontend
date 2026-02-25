// src/components/user/Notifications.jsx
import React, { useEffect, useState } from "react";
import { getTransactions, getBudgets, fetchGoalsAPI } from "../../api/api";

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Generate notifications dynamically
  useEffect(() => {
    const generateNotifications = async () => {
      try {
        const [transactions, budgets, goals] = await Promise.all([
          getTransactions(),
          getBudgets(),
          fetchGoalsAPI(),
        ]);

        const notifications = [];

        // ✅ 1. Budget Exceeded Warning
        const currentBudget = budgets.find((b) => b.type === "current");

        if (currentBudget) {
          const totalExpense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

          if (totalExpense > currentBudget.total) {
            const exceededAmount = totalExpense - currentBudget.total;
            notifications.push({
              id: Date.now() + 1,
              text: `⚠️ You’ve exceeded your monthly budget by ₹${exceededAmount.toLocaleString()}.`,
              type: "danger",
            });
          }
        }

        // ✅ 2. Goal Reached Alerts
        goals.forEach((g) => {
          if (g.saved >= g.goal && !g.completed) {
            notifications.push({
              id: g._id,
              text: `🎯 Goal reached: Saved ₹${g.goal.toLocaleString()} for "${g.name}"!`,
              type: "success",
            });
          }
        });

        // ✅ 3. High Expense Alert (single transaction > 10,000)
        transactions.forEach((t) => {
          if (t.type === "expense" && t.amount >= 10000) {
            notifications.push({
              id: t._id,
              text: `🚨 Large expense detected: ₹${t.amount.toLocaleString()} on ${t.title}`,
              type: "danger",
            });
          }
        });

        // ✅ 4. No Data Safety
        if (notifications.length === 0) {
          notifications.push({
            id: "safe",
            text: "✅ All good! No alerts at the moment.",
            type: "success",
          });
        }

        setAlerts(notifications);
      } catch (error) {
        console.error("Error generating notifications:", error);
        setAlerts([
          {
            id: "error",
            text: "❌ Failed to load notifications.",
            type: "danger",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateNotifications();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-500 animate-pulse">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Notifications
      </h1>

      <div className="space-y-4 max-w-2xl">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`p-4 rounded-xl shadow text-white ${
              a.type === "danger" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {a.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
