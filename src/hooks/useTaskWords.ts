import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskAdminService } from "../services/taskAdmin.service";
import type { TaskId, WordId } from "../types";

const taskWordsQueryKey = (taskId: TaskId | undefined) =>
  ["task-words-admin", taskId] as const;

export const useTaskWords = (taskId: TaskId | undefined) => {
  return useQuery({
    queryKey: taskWordsQueryKey(taskId),
    queryFn: () => taskAdminService.getTaskWords(taskId as TaskId),
    enabled: Boolean(taskId),
  });
};

export const useAddWordToTask = (taskId: TaskId | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wordId, position }: { wordId: WordId; position: number }) =>
      taskAdminService.addWordToTask(taskId as TaskId, {
        word_id: wordId,
        position,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskWordsQueryKey(taskId) });
    },
  });
};

export const useRemoveWordFromTask = (taskId: TaskId | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wordId: WordId) =>
      taskAdminService.removeWordFromTask(taskId as TaskId, wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskWordsQueryKey(taskId) });
    },
  });
};
