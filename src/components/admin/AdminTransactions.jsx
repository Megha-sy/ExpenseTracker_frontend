import React, { useEffect, useMemo, useState } from "react";
import { getAllTransactionsAdmin } from "../../api/api";
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

const AdminTransactions = () => {
  const [data, setData] = useState([]);

  // ✅ FILTER STATES
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [minAmount, setMinAmount] = useState("");

  useEffect(() => {
    getAllTransactionsAdmin().then(setData);
  }, []);

  // ✅ UNIQUE USERS
  const uniqueUsers = useMemo(() => {
    return [
      ...new Map(
        data
          .filter((t) => t.user)
          .map((t) => [t.user._id, t.user])
      ).values(),
    ];
  }, [data]);

  // ✅ FILTERED DATA
  const filteredTransactions = useMemo(() => {
    return data.filter((t) => {
      return (
        (selectedUser === "" || t.user?._id === selectedUser) &&
        (selectedType === "" || t.type === selectedType) &&
        (minAmount === "" || Number(t.amount) >= Number(minAmount))
      );
    });
  }, [data, selectedUser, selectedType, minAmount]);

  // ✅ KPI CALCULATIONS
  const totalTransactions = filteredTransactions.length;

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // ✅ GRAPH DATA (DATE-WISE)
  const chartData = useMemo(() => {
    const map = {};

    filteredTransactions.forEach((t) => {
      const date = new Date(t.createdAt).toLocaleDateString();

      if (!map[date]) {
        map[date] = { date, income: 0, expense: 0 };
      }

      if (t.type === "income") map[date].income += Number(t.amount);
      if (t.type === "expense") map[date].expense += Number(t.amount);
    });

    return Object.values(map);
  }, [filteredTransactions]);

  return (
    <div className="pt-16 px-6 bg-gray-100 min-h-screen">

      {/* ✅ HEADER */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Transaction Analytics
      </h2>

      {/* ✅ FILTER BAR */}
      <div className="bg-white p-5 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* TYPE FILTER */}
        <select
          className="border p-2 rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* MIN AMOUNT FILTER */}
        <input
          type="number"
          placeholder="Minimum Amount"
          className="border p-2 rounded"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
      </div>

      {/* ✅ KPI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-3xl font-bold text-blue-600">
            {totalTransactions}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="text-3xl font-bold text-red-600">
            ₹{totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ✅ ✅ COLORED GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow mb-12">
        <h3 className="text-lg font-semibold mb-4">
          Income vs Expense Trend
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>

            <defs>
              {/* ✅ GREEN INCOME GRADIENT */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>

              {/* ✅ RED EXPENSE GRADIENT */}
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            {/* ✅ INCOME (GREEN) */}
            <Area
              type="monotone"
              dataKey="income"
              fill="url(#incomeGradient)"
              stroke="#22c55e"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            {/* ✅ EXPENSE (RED) */}
            <Area
              type="monotone"
              dataKey="expense"
              fill="url(#expenseGradient)"
              stroke="#ef4444"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ TRANSACTIONS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr
                key={t._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{t.user?.name}</td>

                <td className="py-3 px-4 font-semibold">
                  ₹{t.amount}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>

                <td className="py-3 px-4 text-gray-600">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
