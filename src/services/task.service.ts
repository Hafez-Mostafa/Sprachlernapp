import { apiClient } from "../api/client";
import {
  type Task,
  type TaskDetail,
  type SubmitAnswerRequest,
  type TaskCreateRequest,
  type TaskUpdateRequest,
  type WordTaskEntry,
  type LearningProgress,
  type exerciseId,
  type TaskId,
} from "../types";

export const taskService = {
  // GET /exercises/{exerciseId}/tasks - Aufgaben einer Übung auflisten
  getTasksForExercise: async (exId: exerciseId): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/exercises/${exId}/tasks`);
    return response.data;
  },

  // POST /exercises/{exerciseId}/tasks - Aufgabe zu einer Übung hinzufügen
  createTask: async (
    exId: exerciseId,
    payload: TaskCreateRequest,
  ): Promise<Task> => {
    const response = await apiClient.post<Task>(
      `/exercises/${exId}/tasks`,
      payload,
    );
    return response.data;
  },

  // GET /tasks/{taskId} - Einzelne Aufgabe abrufen (inkl. Wörter)
  getTaskById: async (taskId: TaskId): Promise<TaskDetail> => {
    const response = await apiClient.get<TaskDetail>(`/tasks/${taskId}`);
    return response.data;
  },

  // PATCH /tasks/{taskId} - Aufgabe aktualisieren
  updateTask: async (
    taskId: TaskId,
    payload: TaskUpdateRequest,
  ): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}`, payload);
    return response.data;
  },

  // DELETE /tasks/{taskId} - Aufgabe löschen
  deleteTask: async (taskId: TaskId): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  // GET /tasks/{taskId}/words - Wörter einer Aufgabe auflisten
  getTaskWords: async (taskId: TaskId): Promise<WordTaskEntry[]> => {
    const response = await apiClient.get<WordTaskEntry[]>(
      `/tasks/${taskId}/words`,
    );
    return response.data;
  },

  // POST /tasks/{taskId}/words - Wort einer Aufgabe zuordnen
  addWordToTask: async (
    taskId: TaskId,
    payload: { word_id: string; position: number },
  ): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/words`, payload);
  },

  // DELETE /tasks/{taskId}/words/{wordId} - Wort-Zuordnung entfernen
  removeWordFromTask: async (taskId: TaskId, wordId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}/words/${wordId}`);
  },

  // POST /tasks/{taskId}/submit - Antwort einreichen
  submitAnswer: async (
    taskId: TaskId,
    payload: SubmitAnswerRequest,
  ): Promise<LearningProgress> => {
    const response = await apiClient.post<LearningProgress>(
      `/tasks/${taskId}/submit`,
      payload,
    );
    return response.data;
  },
};
