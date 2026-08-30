import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wordAdminService } from "../services/wordAdmin.service";
import type { WordCreateRequest } from "../types";

export const useWordSearchAdmin = (
  languageId: number | undefined,
  search: string,
) => {
  return useQuery({
    queryKey: ["word-search-admin", languageId, search],
    queryFn: () =>
      wordAdminService.getWords({
        language_id: languageId,
        search: search || undefined,
      }),
    enabled: languageId !== undefined,
  });
};

export const useCreateWordAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WordCreateRequest) =>
      wordAdminService.createWord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-search-admin"] });
    },
  });
};
