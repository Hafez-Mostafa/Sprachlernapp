import { useQueries } from "@tanstack/react-query";
import { wordService } from "../services/word.service";
import type { WordId } from "../types";

/**
 * Lädt für eine Liste von Wort-IDs parallel die Detail-Daten (inkl. Bild/Audio).
 * Die echte API liefert images/audios als Array (Plural) statt image/audio -
 * daher greifen wir hier defensiv auf das erste Element zu.
 */
export const useWordDetails = (wordIds: WordId[]) => {
  const results = useQueries({
    queries: wordIds.map((id) => ({
      queryKey: ["word-detail", id],
      queryFn: () => wordService.getWordById(id),
      enabled: Boolean(id),
    })),
  });

  return {
    data: results.map((r) => r.data),
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
};

// Hilfsfunktion: erstes Bild/Audio aus dem Array holen, unabhängig davon
// ob images/audios null, undefined oder ein Array ist.
type WordWithMedia = {
  images?: { url?: string }[] | null;
  audios?: { url?: string }[] | null;
  image?: { url?: string } | null;
  audio?: { url?: string } | null;
  word_id?: string;
  text?: string;
  language_id?: number;
  created_at?: string;
};

export const firstImageUrl = (
  word: WordWithMedia | undefined,
): string | undefined => word?.images?.[0]?.url ?? word?.image?.url;

export const firstAudioUrl = (
  word: WordWithMedia | undefined,
): string | undefined => word?.audios?.[0]?.url ?? word?.audio?.url;
