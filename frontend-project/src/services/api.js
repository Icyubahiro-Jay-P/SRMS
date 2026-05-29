import axios from "axios";

const API_URL = "/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth service
export const authService = {
  register: (username, email, password) =>
    apiClient.post("/auth/register", { username, email, password }),

  login: (username, password) =>
    apiClient.post("/auth/login", { username, password }),

  logout: () => apiClient.post("/auth/logout"),

  getMe: () => apiClient.get("/auth/me"),
};

// Customer service
export const customerService = {
  create: (data) => apiClient.post("/customers", data),

  getAll: (params) => apiClient.get("/customers", { params }),

  getOne: (customerNumber) => apiClient.get(`/customers/${customerNumber}`),

  update: (customerNumber, data) =>
    apiClient.put(`/customers/${customerNumber}`, data),

  delete: (customerNumber) => apiClient.delete(`/customers/${customerNumber}`),
};

// Product service
export const productService = {
  create: (data) => apiClient.post("/products", data),

  getAll: (params) => apiClient.get("/products", { params }),

  getOne: (productCode) => apiClient.get(`/products/${productCode}`),

  update: (productCode, data) =>
    apiClient.put(`/products/${productCode}`, data),

  delete: (productCode) => apiClient.delete(`/products/${productCode}`),
};

// Sale service
export const saleService = {
  create: (data) => apiClient.post("/sales", data),

  getAll: (params) => apiClient.get("/sales", { params }),

  getOne: (invoiceNumber) => apiClient.get(`/sales/${invoiceNumber}`),

  update: (invoiceNumber, data) =>
    apiClient.put(`/sales/${invoiceNumber}`, data),

  delete: (invoiceNumber) => apiClient.delete(`/sales/${invoiceNumber}`),
};

// Report service
export const reportService = {
  getDailyReport: (params) => apiClient.get("/reports/daily", { params }),

  getWeeklyReport: (params) => apiClient.get("/reports/weekly", { params }),

  getMonthlyReport: (params) => apiClient.get("/reports/monthly", { params }),

  getSummary: () => apiClient.get("/reports/summary"),
};

export default apiClient;
