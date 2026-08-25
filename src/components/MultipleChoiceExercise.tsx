import React, { useMemo, useState } from "react";
import { useWordDetails, firstImageUrl } from "../hooks/useWordDetails";
import type { Word } from "../types";
import { useWordPool } from "../hooks/useWordPool";

interface MultipleChoiceExerciseProps {
  correctAnswer: string;
  words: Word[]; // Antwortoptionen aus task.words - kann leer sein
  languageId?: number; // Fallback-Pool, falls task.words leer ist
  onSubmit: (isCorrect: boolean, answerText: string) => void;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  correctAnswer,
  words,
  languageId,
  onSubmit,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const hasLinkedWords = words.length > 0;

  // Fallback: falls task.words leer ist, Distraktoren aus allgemeinem
  // Wort-Pool der Sprache ziehen (ohne Bild, da kein verknüpftes Wort existiert)
  const pool = useWordPool(!hasLinkedWords ? languageId : undefined);

  const options = useMemo(() => {
    if (hasLinkedWords) {
      return shuffle(words.map((w) => w.text ?? ""));
    }
    const poolTexts = (pool.data ?? [])
      .map((w) => w.text ?? "")
      .filter((text) => text && text !== correctAnswer);
    const distractors = shuffle(poolTexts).slice(0, 3);
    return shuffle([correctAnswer, ...distractors]);
  }, [hasLinkedWords, words, pool.data, correctAnswer]);

  const targetWord = words.find((w) => w.text === correctAnswer);
  const wordDetails = useWordDetails(
    targetWord?.word_id ? [targetWord.word_id] : [],
  );
  const imageUrl = firstImageUrl(wordDetails.data[0]);

  const handleSelect = (option: string) => {
    if (selected) return; // schon beantwortet
    setSelected(option);
    onSubmit(option === correctAnswer, option);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl" aria-hidden="true">
            🖼️
          </span>
        )}
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={Boolean(selected)}
            className={`rounded-xl border-2 py-3 text-base font-semibold transition ${selected === option
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
