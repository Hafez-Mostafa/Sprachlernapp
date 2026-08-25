import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exerciseAdminService } from "../services/exerciseAdmin.service";

import { EXERCISES_ADMIN_QUERY_KEY } from "./useExercisesAdmin";
import type {
  exerciseId,
  ExerciseCreateRequest,
  ExerciseUpdateRequest,
} from "../types";

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExerciseCreateRequest) =>
      exerciseAdminService.createExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_ADMIN_QUERY_KEY });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: exerciseId;
      payload: ExerciseUpdateRequest;
    }) => exerciseAdminService.updateExercise(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_ADMIN_QUERY_KEY });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: exerciseId) => exerciseAdminService.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_ADMIN_QUERY_KEY });
    },
  });
};
