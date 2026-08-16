import { apiClient } from "../api/client";
import {
  type ChildProfile,
  type ChildProfileCreateRequest,
  type ChildProfileUpdateRequest,
  type LearningProgress,
  type ChildId,
} from "../types";

export const childService = {
  // GET /guardians/me/children - Alle Kinderprofile abrufen
  getChildren: async (): Promise<ChildProfile[]> => {
    const response = await apiClient.get<ChildProfile[]>(
      "/guardians/me/children",
    );
    return response.data;
  },

  // POST /guardians/me/children - Neues Kinderprofil anlegen
  createChild: async (
    payload: ChildProfileCreateRequest,
  ): Promise<ChildProfile> => {
    const response = await apiClient.post<ChildProfile>(
      "/guardians/me/children",
      payload,
    );
    return response.data;
  },

  // GET /children/{childId} - Kinderprofil abrufen
  getChildById: async (childId: ChildId): Promise<ChildProfile> => {
    const response = await apiClient.get<ChildProfile>(`/children/${childId}`);
    return response.data;
  },

  // PATCH /children/{childId} - Kinderprofil aktualisieren
  updateChild: async (
    childId: ChildId,
    payload: ChildProfileUpdateRequest,
  ): Promise<ChildProfile> => {
    const response = await apiClient.patch<ChildProfile>(
      `/children/${childId}`,
      payload,
    );
    return response.data;
  },

  // DELETE /children/{childId} - Kinderprofil löschen
  deleteChild: async (childId: ChildId): Promise<void> => {
    await apiClient.delete(`/children/${childId}`);
  },

  // GET /children/{childId}/progress - Lernfortschritt eines Kindes abrufen
  getChildProgress: async (
    childId: ChildId,
    params?: { status?: string },
  ): Promise<LearningProgress[]> => {
    const response = await apiClient.get<LearningProgress[]>(
      `/children/${childId}/progress`,
      {
        params,
      },
    );
    return response.data;
  },
};
