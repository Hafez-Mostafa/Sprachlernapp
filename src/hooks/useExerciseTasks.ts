import { useQuery } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import type { exerciseId as ExerciseIdType } from "../types";

export const useExerciseTasks = (exerciseId: ExerciseIdType | undefined) => {
  return useQuery({
    queryKey: ["exercise-tasks", exerciseId],
    queryFn: () =>
      taskService.getTasksForExercise(exerciseId as ExerciseIdType),
    enabled: Boolean(exerciseId),
  });
};
