import { useQuery } from "@tanstack/react-query";
import { wordAdminService } from "../services/wordAdmin.service";

export const wordsAdminQueryKey = (languageId?: number, search?: string) =>
  ["words-admin", languageId, search] as const;

export const useWordsAdmin = (languageId?: number, search?: string) => {
  return useQuery({
    queryKey: wordsAdminQueryKey(languageId, search),
    queryFn: () =>
      wordAdminService.getWords({
        language_id: languageId,
        search: search || undefined,
      }),
  });
};
