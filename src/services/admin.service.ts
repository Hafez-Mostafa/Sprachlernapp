import { apiClient } from "../api/client";

import { type Admin } from "../types";

export const adminService = {
  // GET /admins/me - Admin-Profil abrufen
  getProfile: async (): Promise<Admin> => {
    const response = await apiClient.get<Admin>("/admins/me");
    return response.data;
  },
};
