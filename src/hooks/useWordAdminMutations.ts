import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wordAdminService } from "../services/wordAdmin.service";
import type { WordId, WordCreateRequest, WordUpdateRequest } from "../types";

// Invalidiert alle words-admin Listen-Queries unabhängig von Filter-Params
const invalidateWordsLists = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["words-admin"] });

export const useCreateWordAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WordCreateRequest) =>
      wordAdminService.createWord(payload),
    onSuccess: () => invalidateWordsLists(queryClient),
  });
};

export const useUpdateWordAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      wordId,
      payload,
    }: {
      wordId: WordId;
      payload: WordUpdateRequest;
    }) => wordAdminService.updateWord(wordId, payload),
    onSuccess: () => invalidateWordsLists(queryClient),
  });
};

export const useDeleteWordAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wordId: WordId) => wordAdminService.deleteWord(wordId),
    onSuccess: () => invalidateWordsLists(queryClient),
  });
};
