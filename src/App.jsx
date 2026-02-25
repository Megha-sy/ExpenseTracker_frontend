// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/shared/Navbar";

// ✅ Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

// User Module Components
import Dashboard from "./components/user/Dashboard";
import Transactions from "./components/user/Transactions";
import TransactionList from "./components/user/TransactionList";
import Profile from "./components/user/Profile";
import BudgetSummary from "./components/user/BudgetSummary";
import Chatbot from "./components/user/Chatbot";
import InsightsPanel from "./components/user/InsightsPanel";
import Reports from "./components/user/Reports";
import Goals from "./components/user/Goals";
import Notifications from "./components/user/Notifications";
import CategoryManager from "./components/user/CategoryManager";
import PriorityGoals from "./components/user/PriorityGoals";
import EditTransaction from "./components/user/EditTransaction";
import ChangePassword from "./components/user/ChangePassword";

// Auth Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import LandingPage from "./pages/LandingPage";


// Auth Context
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminTransactions from "./components/admin/AdminTransactions";
import AdminGoals from "./components/admin/AdminGoals";
import AdminBudgets from "./components/admin/AdminBudgets";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto mt-6">
        <Routes>
          {/* 🌍 Public Pages */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* 🔐 Protected (User) Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-list"
            element={
              <ProtectedRoute>
                <TransactionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <InsightsPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/priority-goals"
            element={
              <ProtectedRoute>
                <PriorityGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
       
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-transaction/:id"
            element={
              <ProtectedRoute>
                <EditTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
{/* adminn           */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="transactions" element={<AdminTransactions />} />
    <Route path="budgets" element={<AdminBudgets />} />
    <Route path="goals" element={<AdminGoals />} />
  </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
