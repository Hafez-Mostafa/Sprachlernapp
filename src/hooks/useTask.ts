import { useQuery } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import type { TaskId } from "../types";

export const useTask = (taskId: TaskId | undefined) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getTaskById(taskId as TaskId),
    enabled: Boolean(taskId),
  });
};
