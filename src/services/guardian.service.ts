import { apiClient } from "../api/client";
import {
  type Guardian,
  type GuardianRegisterRequest,
  type GuardianUpdateRequest,
} from "../types";

export const guardianService = {
  // POST /guardians - Guardian-Konto registrieren
  register: async (payload: GuardianRegisterRequest): Promise<Guardian> => {
    const response = await apiClient.post<Guardian>("/guardians", payload);
    return response.data;
  },

  // GET /guardians/me - Eigenes Profil abrufen
  getProfile: async (): Promise<Guardian> => {
    const response = await apiClient.get<Guardian>("/guardians/me");
    return response.data;
  },

  // PATCH /guardians/me - Eigenes Profil aktualisieren
  updateProfile: async (payload: GuardianUpdateRequest): Promise<Guardian> => {
    const response = await apiClient.patch<Guardian>("/guardians/me", payload);
    return response.data;
  },

  // DELETE /guardians/me - Eigenes Konto löschen
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/guardians/me");
  },
};
