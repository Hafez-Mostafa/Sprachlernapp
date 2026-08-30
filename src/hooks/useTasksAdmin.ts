import { useQuery } from "@tanstack/react-query";
import { taskAdminService } from "../services/taskAdmin.service";
import type { exerciseId as ExerciseIdType } from "../types";

export const tasksAdminQueryKey = (exerciseId: ExerciseIdType | undefined) =>
  ["tasks-admin", exerciseId] as const;

export const useTasksAdmin = (exerciseId: ExerciseIdType | undefined) => {
  return useQuery({
    queryKey: tasksAdminQueryKey(exerciseId),
    queryFn: () =>
      taskAdminService.getTasksForExercise(exerciseId as ExerciseIdType),
    enabled: Boolean(exerciseId),
  });
};

export default useTasksAdmin;
