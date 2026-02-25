import React, { useEffect, useState } from "react";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getTransactions,
} from "../../api/api";
import { useNavigate } from "react-router-dom";

const BudgetSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [newBudget, setNewBudget] = useState("");
  const [upcomingMonth, setUpcomingMonth] = useState("");
  const [upcomingBudget, setUpcomingBudget] = useState("");

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access budgets.");
      navigate("/login");
      return;
    }
    handleMonthCheck();
  }, []);

  // 🔐 Secure API Wrapper
  const safeCall = async (fn, ...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      }
      throw err;
    }
  };

  // ✅ Auto Move Budget Month Logic
  const handleMonthCheck = async () => {
    try {
      const data = await safeCall(getBudgets);

      const current = data.find((b) => b.type === "current");
      const upcoming = data.filter((b) => b.type === "upcoming");

      const systemMonth = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const lastMovedMonth = localStorage.getItem("lastMovedMonth");

      if (current && current.month !== systemMonth && lastMovedMonth !== current.month) {
        const alreadyInHistory = data.find(
          (b) => b.type === "history" && b.month === current.month
        );

        if (!alreadyInHistory) {
          await safeCall(updateBudget, current._id, { type: "history" });
          localStorage.setItem("lastMovedMonth", current.month);
        }

        const nextBudget = upcoming.find((b) => b.month === systemMonth);

        if (nextBudget) {
          await safeCall(updateBudget, nextBudget._id, { type: "current" });
        }
      }

      fetchBudgets();
    } catch (err) {
      console.error("Error month auto-switch:", err);
    }
  };

  // ✅ Fetch Budgets and Transactions
  const fetchBudgets = async () => {
    try {
      const data = await safeCall(getBudgets);
      setBudgets(data);

      const tx = await safeCall(getTransactions);
      setTransactions(tx);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Budget Filters
  const currentBudget = budgets.find((b) => b.type === "current");
  const history = budgets.filter((b) => b.type === "history");
  const upcomingBudgets = budgets.filter((b) => b.type === "upcoming");

  // ✅ Current Month Expense Only
  const totalExpense = transactions
    .filter((t) => {
      const txMonth = new Date(t.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      return t.type === "expense" && txMonth === currentMonth;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const total = currentBudget?.total || 0;
  const spent = totalExpense;
  const remaining = total - spent;

  const percent =
    total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

  // ✅ FIXED: CALCULATE SPENT FOR PREVIOUS MONTHS
  const calculateSpentForMonth = (monthLabel) => {
    return transactions
      .filter((t) => {
        const txMonth = new Date(t.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        return t.type === "expense" && txMonth === monthLabel;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  };

  // ✅ Update Current Budget
  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!newBudget) return;

    try {
      const systemMonth = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (currentBudget && currentBudget.month === systemMonth) {
        await safeCall(updateBudget, currentBudget._id, {
          total: parseInt(newBudget),
        });
      } else {
        await safeCall(addBudget, {
          month: systemMonth,
          total: parseInt(newBudget),
          type: "current",
        });
      }

      setNewBudget("");
      fetchBudgets();
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  // ✅ Upcoming Budget
  const handleAddUpcomingBudget = async (e) => {
    e.preventDefault();
    if (!upcomingMonth || !upcomingBudget) return;

    try {
      await safeCall(addBudget, {
        month: new Date(upcomingMonth).toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        total: parseInt(upcomingBudget),
        type: "upcoming",
      });

      setUpcomingMonth("");
      setUpcomingBudget("");
      fetchBudgets();
    } catch (err) {
      console.error("Error adding upcoming budget:", err);
    }
  };

  const handleDeleteUpcoming = async (id) => {
    if (!window.confirm("Delete this upcoming budget?")) return;
    try {
      await safeCall(deleteBudget, id);
      fetchBudgets();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-500 text-lg animate-pulse">
        Loading your budget...
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">

      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Budget Dashboard 💰
      </h1>

      {/* CURRENT + UPCOMING */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-9 mb-8">

        {/* CURRENT */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Current Month: {currentMonth}
          </h2>

          <form onSubmit={handleUpdateBudget} className="mb-4 flex gap-2 flex-wrap">
            <input
              type="number"
              placeholder="Set new budget (₹)"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="flex-1 border p-2 rounded-lg"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Update
            </button>
          </form>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Budget:</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Spent:</span>
              <span className="text-red-600">₹{spent}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className="text-green-600">
                ₹{remaining >= 0 ? remaining : 0}
              </span>
            </div>

            <div className="mt-4 h-4 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="text-sm">{percent}% used</p>
          </div>
        </div>

        {/* UPCOMING */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Upcoming Month Budget
          </h2>

          <form onSubmit={handleAddUpcomingBudget} className="flex gap-2 mb-4">
            <input
              type="month"
              value={upcomingMonth}
              onChange={(e) => setUpcomingMonth(e.target.value)}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Budget (₹)"
              value={upcomingBudget}
              onChange={(e) => setUpcomingBudget(e.target.value)}
              className="border p-2 rounded-lg"
              required
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Add
            </button>
          </form>

          {upcomingBudgets.map((b) => (
            <div key={b._id} className="flex justify-between mb-2">
              <span>{b.month}</span>
              <span>₹{b.total}</span>
              <button
                onClick={() => handleDeleteUpcoming(b._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ PREVIOUS MONTH FIXED SECTION ✅ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Previous Month Summary
        </h2>

        {history.map((h) => {
          const spentForMonth = calculateSpentForMonth(h.month);
          const usedPercent =
            h.total > 0
              ? Math.min(100, Math.round((spentForMonth / h.total) * 100))
              : 0;

          return (
            <div key={h._id} className="bg-white p-4 rounded-xl shadow mb-3">
              <div className="flex justify-between">
                <span>{h.month}</span>
                <span>{usedPercent}% used</span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-sm mt-1">
                <span>Spent: ₹{spentForMonth}</span>
                <span>Total: ₹{h.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetSummary;
