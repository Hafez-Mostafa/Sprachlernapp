import { apiClient } from "../api/client";
import { type LookupItem, type Language } from "../types";

export const lookupService = {
  // GET /languages - Sprachen (eigenes Schema, siehe types/index.ts)
  getLanguages: async (): Promise<Language[]> => {
    const response = await apiClient.get<Language[]>("/languages");
    return response.data;
  },

  // GET /exercise-types - Übungstypen
  getExerciseTypes: async (): Promise<LookupItem[]> => {
    const response = await apiClient.get<LookupItem[]>("/exercise-types");
    return response.data;
  },

  // GET /progress-statuses - Fortschrittsstatus
  getProgressStatuses: async (): Promise<LookupItem[]> => {
    const response = await apiClient.get<LookupItem[]>("/progress-statuses");
    return response.data;
  },
};
