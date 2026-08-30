import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wordAdminService } from "../services/wordAdmin.service";
import type {
  WordId,
  ImageUpsertRequest,
  AudioUpsertRequest,
} from "../types";

const wordDetailQueryKey = (wordId: WordId | undefined) =>
  ["word-detail-admin", wordId] as const;

export const useWordDetailAdmin = (wordId: WordId | undefined) => {
  return useQuery({
    queryKey: wordDetailQueryKey(wordId),
    queryFn: () => wordAdminService.getWordById(wordId as WordId),
    enabled: Boolean(wordId),
  });
};

export const useUpsertWordImage = (wordId: WordId | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ImageUpsertRequest) =>
      wordAdminService.upsertWordImage(wordId as WordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wordDetailQueryKey(wordId) });
    },
  });
};

export const useDeleteWordImage = (wordId: WordId | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => wordAdminService.deleteWordImage(wordId as WordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wordDetailQueryKey(wordId) });
    },
  });
};

export const useUpsertWordAudio = (wordId: WordId | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AudioUpsertRequest) =>
      wordAdminService.upsertWordAudio(wordId as WordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wordDetailQueryKey(wordId) });
    },
  });
};

export const useDeleteWordAudio = (wordId: WordId | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => wordAdminService.deleteWordAudio(wordId as WordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wordDetailQueryKey(wordId) });
    },
  });
};
