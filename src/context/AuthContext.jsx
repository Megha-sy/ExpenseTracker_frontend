import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Hook to use context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/users/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/api/users/register", { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Context value
  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
