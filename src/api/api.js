import axios from "axios";

const API = axios.create({
  baseURL: "https://expensetracker-backend-1-urxk.onrender.com/api", 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  throw error.response?.data || { message: "Something went wrong!" };
};


// ✅ Register user
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/users/register", userData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Login user
export const loginUser = async (userData) => {
  try {
    const res = await API.post("/users/login", userData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Update profile (requires authentication)
export const updateProfile = async (updates) => {
  try {
    const res = await API.put("/users/profile", updates);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Change password (requires authentication)
export const changePassword = async (passwordData) => {
  try {
    const res = await API.put("/users/change-password", passwordData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};



// ✅ Fetch all transactions for the logged-in user
export const getTransactions = async () => {
  try {
    const res = await API.get("/transactions");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get transaction by ID
export const getTransactionById = async (id) => {
  try {
    const res = await API.get(`/transactions/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Create new transaction (with optional screenshot)
export const createTransaction = async (data) => {
  try {
    const res = await API.post("/transactions", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Update existing transaction
export const updateTransaction = async (id, data) => {
  try {
    const res = await API.put(`/transactions/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const res = await API.delete(`/transactions/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};



// ✅ Get categories
export const getCategories = async () => {
  try {
    const res = await API.get("/categories");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Add new category
export const createCategory = async (data) => {
  try {
    const res = await API.post("/categories", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Delete category
export const deleteCategory = async (id) => {
  try {
    const res = await API.delete(`/categories/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};



// ✅ Get all budgets
export const getBudgets = async () => {
  try {
    const res = await API.get("/budgets");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Add new budget
export const addBudget = async (budgetData) => {
  try {
    const res = await API.post("/budgets", budgetData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Update budget
export const updateBudget = async (id, updates) => {
  try {
    const res = await API.put(`/budgets/${id}`, updates);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Delete budget
export const deleteBudget = async (id) => {
  try {
    const res = await API.delete(`/budgets/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const fetchGoalsAPI = async () => {
  try {
    const res = await API.get("/goals");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addGoalAPI = async (goalData) => {
  try {
    const res = await API.post("/goals", goalData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateGoalAPI = async (id, updates) => {
  try {
    const res = await API.put(`/goals/${id}`, updates);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteGoalAPI = async (id) => {
  try {
    const res = await API.delete(`/goals/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const togglePriorityAPI = async (id) => {
  try {
    const res = await API.patch(`/goals/${id}/priority`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const getAIInsights = async () => {
  try {
    const res = await API.get("/ai");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};


//admin
export const fetchAdminSummary = async () => {
  const res = await API.get("/admin/fetchAdminSummary");
  return res.data;
};

export const getAllTransactionsAdmin = async () => {
  const res = await API.get("/admin/transactions");
  return res.data;
};

export const getAllBudgetsAdmin = async () => {
  const res = await API.get("/admin/budgets");
  return res.data;
};

export const getAllGoalsAdmin = async () => {
  const res = await API.get("/admin/goals");
  return res.data;
};
// ✅ EDIT USER
export const editUser = async (id, data) => {
  const res = await API.put(`/admin/users/${id}`, data);
  return res.data;
};

// ✅ DELETE USER
export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};