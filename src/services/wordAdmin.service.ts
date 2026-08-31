import {
  adminApiClient,
  apiClient,
  requestWithTokenFallback,
} from "../api/client";
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
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<Word[]>("/words", { params }),
      () => apiClient.get<Word[]>("/words", { params }),
    );
    return response.data;
  },

  getWordById: async (wordId: WordId): Promise<WordDetail> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.get<WordDetail>(`/words/${wordId}`),
      () => apiClient.get<WordDetail>(`/words/${wordId}`),
    );
    return response.data;
  },

  createWord: async (payload: WordCreateRequest): Promise<Word> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.post<Word>("/words", payload),
      () => apiClient.post<Word>("/words", payload),
    );
    return response.data;
  },

  updateWord: async (
    wordId: WordId,
    payload: WordUpdateRequest,
  ): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.patch(`/words/${wordId}`, payload),
      () => apiClient.patch(`/words/${wordId}`, payload),
    );
  },

  deleteWord: async (wordId: WordId): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.delete(`/words/${wordId}`),
      () => apiClient.delete(`/words/${wordId}`),
    );
  },

  upsertWordImage: async (
    wordId: WordId,
    payload: ImageUpsertRequest,
  ): Promise<Image> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.put<Image>(`/words/${wordId}/image`, payload),
      () => apiClient.put<Image>(`/words/${wordId}/image`, payload),
    );
    return response.data;
  },

  deleteWordImage: async (wordId: WordId): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.delete(`/words/${wordId}/image`),
      () => apiClient.delete(`/words/${wordId}/image`),
    );
  },

  uploadWordImage: async (
    wordId: WordId,
    file: File,
    description?: string,
  ): Promise<Image> => {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    const response = await requestWithTokenFallback(
      () =>
        adminApiClient.put<Image>(`/words/${wordId}/image/upload`, formData),
      () => apiClient.put<Image>(`/words/${wordId}/image/upload`, formData),
    );
    return response.data;
  },

  upsertWordAudio: async (
    wordId: WordId,
    payload: AudioUpsertRequest,
  ): Promise<Audio> => {
    const response = await requestWithTokenFallback(
      () => adminApiClient.put<Audio>(`/words/${wordId}/audio`, payload),
      () => apiClient.put<Audio>(`/words/${wordId}/audio`, payload),
    );
    return response.data;
  },

  deleteWordAudio: async (wordId: WordId): Promise<void> => {
    await requestWithTokenFallback(
      () => adminApiClient.delete(`/words/${wordId}/audio`),
      () => apiClient.delete(`/words/${wordId}/audio`),
    );
  },

  uploadWordAudio: async (wordId: WordId, file: File): Promise<Audio> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await requestWithTokenFallback(
      () =>
        adminApiClient.put<Audio>(`/words/${wordId}/audio/upload`, formData),
      () => apiClient.put<Audio>(`/words/${wordId}/audio/upload`, formData),
    );
    return response.data;
  },
};
