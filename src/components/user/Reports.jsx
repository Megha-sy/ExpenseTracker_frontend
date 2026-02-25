// src/components/user/Reports.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getTransactions } from "../../api/api";

const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B", "#3B82F6"];

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // ✅ calendar state

  // ✅ Fetch user transactions
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
        processReports(data);
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };

    loadData();
  }, []);

  // ✅ Re-filter when month changes
  useEffect(() => {
    if (transactions.length > 0) {
      processReports(transactions);
    }
  }, [selectedMonth]);

  // ✅ MASTER PROCESSOR
  const processReports = (data) => {
    let filteredData = data;

    // ✅ Filter by selected month if chosen
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      filteredData = data.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getFullYear() === Number(year) &&
          d.getMonth() + 1 === Number(month)
        );
      });
    }

    generateMonthlyReport(filteredData);
    generateCategoryReport(filteredData);
  };

  // ✅ Generate monthly summary (income, expense, savings)
  const generateMonthlyReport = (data) => {
    const monthMap = {};

    data.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "long",
      });

      if (!monthMap[month]) {
        monthMap[month] = { month, income: 0, expense: 0, savings: 0 };
      }

      if (t.type === "income") monthMap[month].income += Number(t.amount);
      else monthMap[month].expense += Number(t.amount);
    });

    const formatted = Object.values(monthMap).map((m) => ({
      ...m,
      savings: m.income - m.expense,
    }));

    setMonthlyData(formatted);
  };

  // ✅ Generate category spending report
  const generateCategoryReport = (data) => {
    const categoryMap = {};

    data
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!categoryMap[t.category]) categoryMap[t.category] = 0;
        categoryMap[t.category] += Number(t.amount);
      });

    const formatted = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    setCategoryData(formatted);
  };

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Reports & Analytics
      </h1>

      {/* ✅ MINI CALENDAR (MONTH PICKER) */}
      <div className="flex justify-center mb-8">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* ---------- Charts Section ---------- */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* 📈 Expense Trends Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📈 Expense Trends
          </h2>

          {monthlyData.length === 0 ? (
            <p className="text-gray-500 text-center py-10 italic">
              Not enough data to display the chart.
            </p>
          ) : (
            <LineChart width={350} height={250} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" />
              <Line type="monotone" dataKey="savings" stroke="#3B82F6" />
            </LineChart>
          )}
        </div>

        {/* 🥧 Category-wise Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🥧 Category-wise Spending
          </h2>

          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-10 italic">
              No expenses found for categories.
            </p>
          ) : (
            <PieChart width={350} height={250}>
              <Pie
                data={categoryData}
                cx={170}
                cy={120}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>
      </div>

      {/* ---------- Monthly Summary Table ---------- */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Monthly Summary
        </h2>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 rounded-t-lg">
            <tr className="text-gray-600 uppercase text-sm">
              <th className="py-3 px-4">Month</th>
              <th className="py-3 px-4">Income</th>
              <th className="py-3 px-4">Expense</th>
              <th className="py-3 px-4">Savings</th>
            </tr>
          </thead>

          <tbody>
            {monthlyData.map((item, index) => (
              <tr
                key={index}
                className={`transition ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-4 font-medium">{item.month}</td>
                <td className="py-3 px-4 text-green-600 font-semibold">
                  ₹{item.income.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-red-600 font-semibold">
                  ₹{item.expense.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-blue-600 font-semibold">
                  ₹{item.savings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;
