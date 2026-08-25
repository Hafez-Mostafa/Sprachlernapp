import { apiClient, adminApiClient } from "../api/client";
import {
  type LoginRequest,
  type AuthResponse,
  type AdminAuthResponse,
} from "../types";

export const authService = {
  // POST /auth/login - Guardian anmelden (Guardian-Client, korrekt)
  loginGuardian: async (payload: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  // POST /auth/admin-login - Admin anmelden
  // Fix: adminApiClient statt apiClient - sonst wird der Folgeaufruf
  // GET /admins/me (in AuthContext.loginAdmin) mit dem falschen Token-Space
  // ausgeführt und schlägt mit 401 fehl.
  loginAdmin: async (payload: LoginRequest): Promise<AdminAuthResponse> => {
    const response = await adminApiClient.post<AdminAuthResponse>(
      "/auth/admin-login",
      payload,
    );
    return response.data;
  },
};

// import { apiClient } from "../api/client";
// import {
//   type LoginRequest,
//   type AuthResponse,
//   type AdminAuthResponse,
// } from "../types";

// export const authService = {
//   // POST /auth/login - Guardian anmelden
//   loginGuardian: async (payload: LoginRequest): Promise<AuthResponse> => {
//     const response = await apiClient.post<AuthResponse>("/auth/login", payload);
//     return response.data;
//   },

//   // POST /auth/admin-login - Admin anmelden
//   loginAdmin: async (payload: LoginRequest): Promise<AdminAuthResponse> => {
//     const response = await apiClient.post<AdminAuthResponse>(
//       "/auth/admin-login",
//       payload,
//     );
//     return response.data;
//   },
// };
