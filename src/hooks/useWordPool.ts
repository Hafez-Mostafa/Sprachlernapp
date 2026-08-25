import { useQuery } from "@tanstack/react-query";
import { wordService } from "../services/word.service";

/**
 * Lädt einen allgemeinen Wort-Pool einer Sprache. Wird als Fallback genutzt,
 * wenn eine Task keine verknüpften Wörter hat (task.words leer) - damit
 * Multiple-Choice-Aufgaben trotzdem Distraktor-Optionen anzeigen können.
 */
export const useWordPool = (languageId: number | undefined) => {
  return useQuery({
    queryKey: ["word-pool", languageId],
    queryFn: () => wordService.getWords({ language_id: languageId }),
    enabled: languageId !== undefined,
  });
};
