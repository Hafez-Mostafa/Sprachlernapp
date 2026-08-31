import axios from "axios";

// 1. Point fallback to your Vercel backend or NestJS local backend port (3001)
// 2. Remove any trailing slashes to prevent double-slash issues (//)
const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sprachlern-fzx857kh2-mosmoyas-projects.vercel.app";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

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

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("guardian_token");

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

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  return config;
});

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");

      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login?expired=true";
      }
    }
    return Promise.reject(error);
  },
);

export const requestWithTokenFallback = async <T>(
  adminRequest: () => Promise<T>,
  guardianRequest: () => Promise<T>,
): Promise<T> => {
  try {
    return await adminRequest();
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      return await guardianRequest();
    }
    throw error;
  }
};

// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173/";

// // ---------------------------------------------------------------------------
// // 1. Guardian / Child API Client
// // ---------------------------------------------------------------------------
// export const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("guardian_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("guardian_token");

//       // Prüfen, ob wir nicht bereits auf der Login-Seite sind (Vermeidung von Endlos-Loops)
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login?expired=true";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// // ---------------------------------------------------------------------------
// // 2. Admin API Client
// // ---------------------------------------------------------------------------
// export const adminApiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// adminApiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("admin_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// adminApiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("admin_token");

//       // Prüfen, ob wir nicht bereits auf der Admin-Login-Seite sind
//       if (window.location.pathname !== "/admin/login") {
//         window.location.href = "/admin/login?expired=true";
//       }
//     }
//     return Promise.reject(error);
//   },
// );
