import { adminApiClient } from "../api/client";
import type {
  Word,
  WordDetail,
  WordCreateRequest,
  WordUpdateRequest,
  ImageUpsertRequest,
  Image,
  AudioUpsertRequest,
  Audio,
  WordId,
} from "../types";

export const wordAdminService = {
  getWords: async (params?: {
    language_id?: number;
    search?: string;
  }): Promise<Word[]> => {
    const response = await adminApiClient.get<Word[]>("/words", { params });
    return response.data;
  },

  getWordById: async (wordId: WordId): Promise<WordDetail> => {
    const response = await adminApiClient.get<WordDetail>(`/words/${wordId}`);
    return response.data;
  },

  createWord: async (payload: WordCreateRequest): Promise<Word> => {
    const response = await adminApiClient.post<Word>("/words", payload);
    return response.data;
  },

  updateWord: async (
    wordId: WordId,
    payload: WordUpdateRequest,
  ): Promise<void> => {
    await adminApiClient.patch(`/words/${wordId}`, payload);
  },

  deleteWord: async (wordId: WordId): Promise<void> => {
    await adminApiClient.delete(`/words/${wordId}`);
  },

  upsertWordImage: async (
    wordId: WordId,
    payload: ImageUpsertRequest,
  ): Promise<Image> => {
    const response = await adminApiClient.put<Image>(
      `/words/${wordId}/image`,
      payload,
    );
    return response.data;
  },

  deleteWordImage: async (wordId: WordId): Promise<void> => {
    await adminApiClient.delete(`/words/${wordId}/image`);
  },

  upsertWordAudio: async (
    wordId: WordId,
    payload: AudioUpsertRequest,
  ): Promise<Audio> => {
    const response = await adminApiClient.put<Audio>(
      `/words/${wordId}/audio`,
      payload,
    );
    return response.data;
  },

  deleteWordAudio: async (wordId: WordId): Promise<void> => {
    await adminApiClient.delete(`/words/${wordId}/audio`);
  },
};
