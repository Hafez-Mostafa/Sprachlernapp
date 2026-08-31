import { apiClient } from "../api/client";
import {
  type Word,
  type WordDetail,
  type WordCreateRequest,
  type WordUpdateRequest,
  type ImageUpsertRequest,
  type Image,
  type AudioUpsertRequest,
  type Audio,
  type WordId,
} from "../types";

export const wordService = {
  // GET /words - Wörter auflisten / suchen
  getWords: async (params?: {
    language_id?: number;
    search?: string;
  }): Promise<Word[]> => {
    const response = await apiClient.get<Word[]>("/words", { params });
    return response.data;
  },

  // POST /words - Neues Wort anlegen
  createWord: async (payload: WordCreateRequest): Promise<Word> => {
    const response = await apiClient.post<Word>("/words", payload);
    return response.data;
  },

  // GET /words/{wordId} - Wort abrufen
  getWordById: async (wordId: WordId): Promise<WordDetail> => {
    const response = await apiClient.get<WordDetail>(`/words/${wordId}`);
    return response.data;
  },

  // PATCH /words/{wordId} - Wort aktualisieren
  updateWord: async (
    wordId: WordId,
    payload: WordUpdateRequest,
  ): Promise<void> => {
    await apiClient.patch(`/words/${wordId}`, payload);
  },

  // DELETE /words/{wordId} - Wort löschen
  deleteWord: async (wordId: WordId): Promise<void> => {
    await apiClient.delete(`/words/${wordId}`);
  },

  // PUT /words/{wordId}/image - Bild setzen/ersetzen
  upsertWordImage: async (
    wordId: WordId,
    payload: ImageUpsertRequest,
  ): Promise<Image> => {
    const response = await apiClient.put<Image>(
      `/words/${wordId}/image`,
      payload,
    );
    return response.data;
  },

  // DELETE /words/{wordId}/image - Bild entfernen
  deleteWordImage: async (wordId: WordId): Promise<void> => {
    await apiClient.delete(`/words/${wordId}/image`);
  },

  // PUT /words/{wordId}/image/upload - Bild als Multipart-Datei hochladen
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

    const response = await apiClient.put<Image>(
      `/words/${wordId}/image/upload`,
      formData,
    );
    return response.data;
  },

  // PUT /words/{wordId}/audio - Audio setzen/ersetzen
  upsertWordAudio: async (
    wordId: WordId,
    payload: AudioUpsertRequest,
  ): Promise<Audio> => {
    const response = await apiClient.put<Audio>(
      `/words/${wordId}/audio`,
      payload,
    );
    return response.data;
  },

  // DELETE /words/{wordId}/audio - Audio entfernen
  deleteWordAudio: async (wordId: WordId): Promise<void> => {
    await apiClient.delete(`/words/${wordId}/audio`);
  },

  // PUT /words/{wordId}/audio/upload - Audio als Multipart-Datei hochladen
  uploadWordAudio: async (wordId: WordId, file: File): Promise<Audio> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.put<Audio>(
      `/words/${wordId}/audio/upload`,
      formData,
    );
    return response.data;
  },
};
