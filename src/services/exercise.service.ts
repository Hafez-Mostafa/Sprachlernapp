import { apiClient } from "../api/client";
import {
  type Exercise,
  type ExerciseCreateRequest,
  type ExerciseUpdateRequest,
  type exerciseId,
} from "../types";

export const exerciseService = {
  // GET /exercises - Übungen auflisten
  getExercises: async (params?: {
    language_id?: number;
    exercise_type_id?: number;
    is_active?: boolean;
  }): Promise<Exercise[]> => {
    const response = await apiClient.get<Exercise[]>("/exercises", { params });
    return response.data;
  },

  // POST /exercises - Neue Übung anlegen
  createExercise: async (payload: ExerciseCreateRequest): Promise<Exercise> => {
    const response = await apiClient.post<Exercise>("/exercises", payload);
    return response.data;
  },

  // GET /exercises/{exerciseId} - Einzelne Übung abrufen
  getExerciseById: async (id: exerciseId): Promise<Exercise> => {
    const response = await apiClient.get<Exercise>(`/exercises/${id}`);
    return response.data;
  },

  // PATCH /exercises/{exerciseId} - Übung aktualisieren
  updateExercise: async (
    id: exerciseId,
    payload: ExerciseUpdateRequest,
  ): Promise<Exercise> => {
    const response = await apiClient.patch<Exercise>(
      `/exercises/${id}`,
      payload,
    );
    return response.data;
  },

  // DELETE /exercises/{exerciseId} - Übung löschen
  deleteExercise: async (id: exerciseId): Promise<void> => {
    await apiClient.delete(`/exercises/${id}`);
  },
};
