import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173/";

// ---------------------------------------------------------------------------
// 1. Guardian / Child API Client
// ---------------------------------------------------------------------------
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("guardian_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("guardian_token");

      // Prüfen, ob wir nicht bereits auf der Login-Seite sind (Vermeidung von Endlos-Loops)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// 2. Admin API Client
// ---------------------------------------------------------------------------
export const adminApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");

      // Prüfen, ob wir nicht bereits auf der Admin-Login-Seite sind
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login?expired=true";
      }
    }
    return Promise.reject(error);
  },
);
