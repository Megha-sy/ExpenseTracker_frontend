import React, { useEffect, useMemo, useState } from "react";
import { getAllBudgetsAdmin } from "../../api/api";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminBudgets = () => {
  const [data, setData] = useState([]);

  // ✅ FILTER STATES
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    getAllBudgetsAdmin().then(setData);
  }, []);

  // ✅ UNIQUE USERS
  const uniqueUsers = useMemo(() => {
    return [
      ...new Map(
        data
          .filter((b) => b.user)
          .map((b) => [b.user._id, b.user])
      ).values(),
    ];
  }, [data]);

  // ✅ UNIQUE MONTHS
  const uniqueMonths = useMemo(() => {
    return [...new Set(data.map((b) => b.month))];
  }, [data]);

  // ✅ FILTERED DATA
  const filteredBudgets = useMemo(() => {
    return data.filter((b) => {
      return (
        (selectedUser === "" || b.user?._id === selectedUser) &&
        (selectedMonth === "" || b.month === selectedMonth)
      );
    });
  }, [data, selectedUser, selectedMonth]);

  // ✅ SUMMARY
  const totalBudgets = filteredBudgets.length;
  const totalAmount = filteredBudgets.reduce(
    (sum, b) => sum + Number(b.total || 0),
    0
  );

  // ✅ GRAPH DATA (MONTH-WISE TOTAL)
  const chartData = useMemo(() => {
    const map = {};
    filteredBudgets.forEach((b) => {
      map[b.month] = (map[b.month] || 0) + Number(b.total || 0);
    });

    return Object.keys(map).map((month) => ({
      month,
      total: map[month],
    }));
  }, [filteredBudgets]);

  return (
    <div className="pt-16 px-6 bg-gray-100 min-h-screen">
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Budget Analytics
        </h2>
      </div>

      {/* ✅ FILTER BAR */}
      <div className="bg-white p-5 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* USER FILTER */}
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

        {/* MONTH FILTER */}
        <select
          className="border p-2 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {uniqueMonths.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ KPI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Budgets</p>
          <p className="text-3xl font-bold text-blue-600">
            {totalBudgets}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Budget Amount</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ✅ ✅ NEW GRAPH DESIGN (AREA + LINE) */}
      <div className="bg-white p-6 rounded-xl shadow mb-12">
        <h3 className="text-lg font-semibold mb-4">
          Monthly Budget Trend
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopOpacity={0.4} />
                <stop offset="95%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            {/* ✅ Smooth Area */}
            <Area
              type="monotone"
              dataKey="total"
              fill="url(#budgetGradient)"
              strokeWidth={3}
            />

            {/* ✅ Sharp Trend Line */}
            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ BUDGET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBudgets.map((b) => (
          <div
            key={b._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-l-4 border-blue-600"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xl font-bold text-gray-800">
                ₹{b.total}
              </h4>
              <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                {b.month}
              </span>
            </div>

            <p className="text-gray-500">
              User:{" "}
              <span className="font-medium text-gray-800">
                {b.user?.name}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* ✅ EMPTY STATE */}
      {filteredBudgets.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          No budgets found for selected filters.
        </p>
      )}
    </div>
  );
};

export default AdminBudgets;
