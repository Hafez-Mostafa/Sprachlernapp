import { useQuery } from "@tanstack/react-query";
import { exerciseService } from "../services/exercise.service";

export const useExercises = (languageId: number | undefined) => {
  return useQuery({
    queryKey: ["exercises", languageId],
    queryFn: () =>
      exerciseService.getExercises({
        language_id: languageId,
        is_active: true,
      }),
    enabled: languageId !== undefined,
  });
};
