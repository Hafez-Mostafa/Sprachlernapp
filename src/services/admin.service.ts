import { adminApiClient } from "../api/client";
import { type Admin } from "../types";

export const adminService = {
  // GET /admins/me - Admin-Profil abrufen
  // Fix: adminApiClient statt apiClient - dieser Endpunkt erfordert
  // ein Admin-Token, nicht das Guardian-Token.
  getProfile: async (): Promise<Admin> => {
    const response = await adminApiClient.get<Admin>("/admins/me");
    return response.data;
  },
};
