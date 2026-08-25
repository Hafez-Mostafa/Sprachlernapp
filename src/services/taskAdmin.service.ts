import { adminApiClient } from "../api/client";
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
    const response = await adminApiClient.get<Task[]>(
      `/exercises/${exId}/tasks`,
    );
    return response.data;
  },

  createTask: async (
    exId: exerciseId,
    payload: TaskCreateRequest,
  ): Promise<Task> => {
    const response = await adminApiClient.post<Task>(
      `/exercises/${exId}/tasks`,
      payload,
    );
    return response.data;
  },

  getTaskById: async (taskId: TaskId): Promise<TaskDetail> => {
    const response = await adminApiClient.get<TaskDetail>(`/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (
    taskId: TaskId,
    payload: TaskUpdateRequest,
  ): Promise<Task> => {
    const response = await adminApiClient.patch<Task>(
      `/tasks/${taskId}`,
      payload,
    );
    return response.data;
  },

  deleteTask: async (taskId: TaskId): Promise<void> => {
    await adminApiClient.delete(`/tasks/${taskId}`);
  },

  getTaskWords: async (taskId: TaskId): Promise<WordTaskEntry[]> => {
    const response = await adminApiClient.get<WordTaskEntry[]>(
      `/tasks/${taskId}/words`,
    );
    return response.data;
  },

  addWordToTask: async (
    taskId: TaskId,
    payload: { word_id: string; position: number },
  ): Promise<void> => {
    await adminApiClient.post(`/tasks/${taskId}/words`, payload);
  },

  removeWordFromTask: async (taskId: TaskId, wordId: string): Promise<void> => {
    await adminApiClient.delete(`/tasks/${taskId}/words/${wordId}`);
  },
};
