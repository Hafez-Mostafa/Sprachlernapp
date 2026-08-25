import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWordDetails, firstImageUrl } from "../hooks/useWordDetails";
import type { Word } from "../types";

interface MatchingExerciseProps {
  words: Word[]; // Bild-Wort-Paare der Aufgabe
  onSubmit: (isCorrect: boolean, answerText: string) => void;
  onSkip: () => void; // falls die Aufgabe nicht spielbar ist (zu wenig Paare)
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  words,
  onSubmit,
  onSkip,
}) => {
  const { t } = useTranslation();

  // Zuordnung braucht mindestens 2 Bild-Wort-Paare, um überhaupt eine
  // sinnvolle Aufgabe zu sein - anders als Multiple Choice gibt es hier
  // keinen sinnvollen Fallback-Pool (es müssen echte Paare sein).
  if (words.length < 2) {
    return (
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <p className="text-slate-500">{t("exercise.taskNotReady")}</p>
        <button
          type="button"
          onClick={onSkip}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {t("exercise.skipTask")}
        </button>
      </div>
    );
  }
  const wordIds = words.map((w) => w.word_id).filter(Boolean) as string[];
  const wordDetails = useWordDetails(wordIds);

  const shuffledWords = useMemo(() => shuffle(words), [words]);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const submittedRef = useRef(false);

  const imageFor = (wordId?: string) =>
    firstImageUrl(wordDetails.data.find((d) => d?.word_id === wordId));

  const handleSelectImage = (wordId: string) => {
    if (matches[wordId]) return; // schon zugeordnet
    setSelectedImageId(wordId);
  };

  const handleSelectWord = (text: string) => {
    if (!selectedImageId) return;
    const nextMatches = { ...matches, [selectedImageId]: text };
    setMatches(nextMatches);
    setSelectedImageId(null);

    if (
      Object.keys(nextMatches).length === words.length &&
      !submittedRef.current
    ) {
      submittedRef.current = true;
      const allCorrect = words.every(
        (w) => w.word_id && nextMatches[w.word_id] === w.text,
      );
      onSubmit(allCorrect, JSON.stringify(nextMatches));
    }
  };

  const matchedTexts = new Set(Object.values(matches));

  return (
    <div className="flex w-full gap-6">
      {/* Bilder-Spalte */}
      <div className="flex flex-1 flex-col gap-3">
        {words.map((w) => (
          <button
            key={w.word_id}
            type="button"
            onClick={() => w.word_id && handleSelectImage(w.word_id)}
            disabled={Boolean(w.word_id && matches[w.word_id])}
            className={`flex h-16 items-center justify-center overflow-hidden rounded-xl border-2 bg-slate-50 transition ${selectedImageId === w.word_id
                ? "border-indigo-600"
                : w.word_id && matches[w.word_id]
                  ? "border-emerald-400"
                  : "border-slate-200"
              }`}
          >
            {imageFor(w.word_id) ? (
              <img
                src={imageFor(w.word_id)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true">🖼️</span>
            )}
          </button>
        ))}
      </div>

      {/* Wörter-Spalte */}
      <div className="flex flex-1 flex-col gap-3">
        {shuffledWords.map((w) => (
          <button
            key={w.word_id}
            type="button"
            onClick={() => w.text && handleSelectWord(w.text)}
            disabled={Boolean(w.text && matchedTexts.has(w.text))}
            className={`h-16 rounded-xl border-2 text-sm font-semibold transition ${w.text && matchedTexts.has(w.text)
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
              }`}
          >
            {w.text}
          </button>
        ))}
      </div>
    </div>
  );
};
