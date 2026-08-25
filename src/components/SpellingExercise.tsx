import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWordDetails, firstImageUrl } from "../hooks/useWordDetails";
import type { Word } from "../types";

interface SpellingExerciseProps {
  correctAnswer: string;
  words: Word[]; // enthält i.d.R. das Zielwort für das angezeigte Bild
  onSubmit: (isCorrect: boolean, answerText: string) => void;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const buildKeyboard = (answer: string): string[] => {
  const answerLetters = answer.toUpperCase().split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const distractors = shuffle(
    alphabet.filter((l) => !answerLetters.includes(l)),
  ).slice(0, Math.max(4, answerLetters.length));
  return shuffle([...new Set(answerLetters)].concat(distractors));
};

export const SpellingExercise: React.FC<SpellingExerciseProps> = ({
  correctAnswer,
  words,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const targetWord = words.find((w) => w.text === correctAnswer) ?? words[0];
  const wordDetails = useWordDetails(
    targetWord?.word_id ? [targetWord.word_id] : [],
  );
  const imageUrl = firstImageUrl(wordDetails.data[0]);

  const answerLetters = useMemo(
    () => correctAnswer.toUpperCase().split(""),
    [correctAnswer],
  );
  const keyboard = useMemo(() => buildKeyboard(correctAnswer), [correctAnswer]);

  const [filled, setFilled] = useState<string[]>([]);
  const submittedRef = useRef(false);

  const handleLetterClick = (letter: string) => {
    if (filled.length >= answerLetters.length) return;
    const next = [...filled, letter];
    setFilled(next);

    if (next.length === answerLetters.length && !submittedRef.current) {
      submittedRef.current = true;
      const answerText = next.join("");
      onSubmit(answerText === correctAnswer.toUpperCase(), answerText);
    }
  };

  const handleBackspace = () => {
    setFilled((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl" aria-hidden="true">
            🖼️
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {answerLetters.map((_, index) => (
          <span
            key={index}
            className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-slate-300 text-lg font-bold text-slate-800"
          >
            {filled[index] ?? ""}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {keyboard.map((letter, index) => (
          <button
            key={`${letter}-${index}`}
            type="button"
            onClick={() => handleLetterClick(letter)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-700 transition hover:border-indigo-400"
          >
            {letter}
          </button>
        ))}
        <button
          type="button"
          onClick={handleBackspace}
          aria-label={t("common.delete")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-sm font-bold text-slate-600"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};
