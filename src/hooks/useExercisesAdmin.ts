import { useQuery } from "@tanstack/react-query";
import { exerciseAdminService } from "../services/exerciseAdmin.service";

export const EXERCISES_ADMIN_QUERY_KEY = ["exercises-admin"] as const;

export const useExercisesAdmin = () => {
  return useQuery({
    queryKey: EXERCISES_ADMIN_QUERY_KEY,
    queryFn: () => exerciseAdminService.getExercises(),
  });
};
