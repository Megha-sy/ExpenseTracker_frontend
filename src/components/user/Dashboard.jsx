// src/components/user/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Target, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getTransactions, fetchGoalsAPI } from "../../api/api";

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [savings, setSavings] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  // ✅ Fetch Transactions + Goals
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ====== TRANSACTIONS ======
        const transactions = await getTransactions();

        const income = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const expense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        setTotalIncome(income);
        setTotalExpense(expense);
        setSavings(income - expense);

        // ====== GOALS ======
        const goals = await fetchGoalsAPI();

        if (goals.length > 0) {
          const totalGoalAmount = goals.reduce(
            (sum, g) => sum + Number(g.goal || 0),
            0
          );

          const totalSaved = goals.reduce(
            (sum, g) => sum + Number(g.saved || 0),
            0
          );

          const percent =
            totalGoalAmount > 0
              ? Math.min(100, Math.round((totalSaved / totalGoalAmount) * 100))
              : 0;

          setGoalProgress(percent);
        } else {
          setGoalProgress(0);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const summaryCards = [
    {
      title: "Total Income",
      amount: `₹${totalIncome.toLocaleString()}`,
      color: "bg-green-100",
      icon: <ArrowUpRight className="text-green-600" />,
    },
    {
      title: "Total Expense",
      amount: `₹${totalExpense.toLocaleString()}`,
      color: "bg-red-100",
      icon: <ArrowDownRight className="text-red-600" />,
    },
    {
      title: "Savings",
      amount: `₹${savings.toLocaleString()}`,
      color: "bg-blue-100",
      icon: <ArrowUpRight className="text-blue-600" />,
    },
    {
      title: "Goal Progress",
      amount: `${goalProgress}%`,
      color: "bg-yellow-100",
      icon: <Target className="text-yellow-600" />,
    },
  ];

  return (
    <div className="pt-24 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        Dashboard Overview
      </h1>

      {/* ✅ SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-md ${card.color} flex items-center justify-between transform transition duration-300 hover:scale-105`}
          >
            <div>
              <h3 className="text-sm text-gray-600">{card.title}</h3>
              <p className="text-2xl font-bold mt-1">{card.amount}</p>
            </div>
            <div>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* ✅ QUICK ACCESS CARDS */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Link
          to="/goals"
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Financial Goals</h2>
            <Target className="w-6 h-6" />
          </div>
          <p className="mt-2 text-gray-100">
            Track and achieve your savings goals
          </p>
        </Link>

        <Link
          to="/priority-goals"
          className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Priority Goals</h2>
            <Star className="w-6 h-6" />
          </div>
          <p className="mt-2 text-gray-100">
            View your most important goals
          </p>
        </Link>
      </div>

      {/* ✅ INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Link
          to="/insights"
          className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI Insights</h2>
            <Star className="w-6 h-6 text-white" />
          </div>
          <p className="mt-2 text-gray-100">
            Get smart insights about your spending
          </p>
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-center text-gray-400 italic">
          📊 Analytics chart coming soon
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
