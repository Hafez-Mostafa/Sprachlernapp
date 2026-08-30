import { useQuery } from "@tanstack/react-query";
import { exerciseAdminService } from "../services/exerciseAdmin.service";
import type { exerciseId as ExerciseIdType } from "../types";

export const useExerciseAdmin = (exerciseId: ExerciseIdType | undefined) => {
    return useQuery({
        queryKey: ["exercise-admin", exerciseId],
        queryFn: () =>
            exerciseAdminService.getExerciseById(exerciseId as ExerciseIdType),
        enabled: Boolean(exerciseId),
    });
};