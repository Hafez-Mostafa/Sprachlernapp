import {
  adminApiClient,
  apiClient,
  requestWithTokenFallback,
} from "../api/client";
import type {
  Exercise,
  ExerciseCreateRequest,
  ExerciseUpdateRequest,
  exerciseId,
} from "../types";

export const exerciseAdminService = {
  getExercises: async (params?: {
    language_id?: number;
    exercise_type_id?: number;
    is_active?: boolean;
  }): Promise<Exercise[]> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<Exercise[]>("/exercises", { params }),
      () => apiClient.get<Exercise[]>("/exercises", { params }),
    );
    return response.data;
  },

  getExerciseById: async (id: exerciseId): Promise<Exercise> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<Exercise>(`/exercises/${id}`),
      () => apiClient.get<Exercise>(`/exercises/${id}`),
    );
    return response.data;
  },

  createExercise: async (payload: ExerciseCreateRequest): Promise<Exercise> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.post<Exercise>("/exercises", payload),
      () => apiClient.post<Exercise>("/exercises", payload),
    );
    return response.data;
  },

  updateExercise: async (
    id: exerciseId,
    payload: ExerciseUpdateRequest,
  ): Promise<Exercise> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.patch<Exercise>(`/exercises/${id}`, payload),
      () => apiClient.patch<Exercise>(`/exercises/${id}`, payload),
    );
    return response.data;
  },

  deleteExercise: async (id: exerciseId): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.delete(`/exercises/${id}`),
      () => apiClient.delete(`/exercises/${id}`),
    );
  },
};
