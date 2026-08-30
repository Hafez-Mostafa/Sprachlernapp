import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskAdminService } from "../services/taskAdmin.service";
import { tasksAdminQueryKey } from "./tasksAdminQueryKey";
import type {
  exerciseId as ExerciseIdType,
  TaskId,
  TaskCreateRequest,
  TaskUpdateRequest,
} from "../types";

export const useCreateTask = (exerciseId: ExerciseIdType | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskCreateRequest) =>
      taskAdminService.createTask(exerciseId as ExerciseIdType, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tasksAdminQueryKey(exerciseId),
      });
    },
  });
};

export const useUpdateTask = (exerciseId: ExerciseIdType | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: TaskId;
      payload: TaskUpdateRequest;
    }) => taskAdminService.updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tasksAdminQueryKey(exerciseId),
      });
    },
  });
};

export const useDeleteTask = (exerciseId: ExerciseIdType | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: TaskId) => taskAdminService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tasksAdminQueryKey(exerciseId),
      });
    },
  });
};
