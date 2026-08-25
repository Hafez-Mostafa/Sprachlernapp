import { useQuery } from "@tanstack/react-query";
import { exerciseService } from "../services/exercise.service";
import type { exerciseId as ExerciseIdType } from "../types";

export const useExercise = (exerciseId: ExerciseIdType | undefined) => {
  return useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: () =>
      exerciseService.getExerciseById(exerciseId as ExerciseIdType),
    enabled: Boolean(exerciseId),
  });
};
