import {
  adminApiClient,
  apiClient,
  requestWithTokenFallback,
} from "../api/client";
import type {
  Task,
  TaskDetail,
  TaskCreateRequest,
  TaskUpdateRequest,
  WordTaskEntry,
  exerciseId,
  TaskId,
} from "../types";

export const taskAdminService = {
  getTasksForExercise: async (exId: exerciseId): Promise<Task[]> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<Task[]>(`/exercises/${exId}/tasks`),
      () => apiClient.get<Task[]>(`/exercises/${exId}/tasks`),
    );
    return response.data;
  },

  createTask: async (
    exId: exerciseId,
    payload: TaskCreateRequest,
  ): Promise<Task> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.post<Task>(`/exercises/${exId}/tasks`, payload),
      () => apiClient.post<Task>(`/exercises/${exId}/tasks`, payload),
    );
    return response.data;
  },

  getTaskById: async (taskId: TaskId): Promise<TaskDetail> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<TaskDetail>(`/tasks/${taskId}`),
      () => apiClient.get<TaskDetail>(`/tasks/${taskId}`),
    );
    return response.data;
  },

  updateTask: async (
    taskId: TaskId,
    payload: TaskUpdateRequest,
  ): Promise<Task> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.patch<Task>(`/tasks/${taskId}`, payload),
      () => apiClient.patch<Task>(`/tasks/${taskId}`, payload),
    );
    return response.data;
  },

  deleteTask: async (taskId: TaskId): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.delete(`/tasks/${taskId}`),
      () => apiClient.delete(`/tasks/${taskId}`),
    );
  },

  getTaskWords: async (taskId: TaskId): Promise<WordTaskEntry[]> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<WordTaskEntry[]>(`/tasks/${taskId}/words`),
      () => apiClient.get<WordTaskEntry[]>(`/tasks/${taskId}/words`),
    );
    return response.data;
  },

  addWordToTask: async (
    taskId: TaskId,
    payload: { word_id: string; position: number },
  ): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.post(`/tasks/${taskId}/words`, payload),
      () => apiClient.post(`/tasks/${taskId}/words`, payload),
    );
  },

  removeWordFromTask: async (taskId: TaskId, wordId: string): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.delete(`/tasks/${taskId}/words/${wordId}`),
      () => apiClient.delete(`/tasks/${taskId}/words/${wordId}`),
    );
  },
};
