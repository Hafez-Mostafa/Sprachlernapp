import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "../types";

interface TaskFormModalProps {
  initialData?: Task;
  defaultPosition: number;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (data: {
    question: string;
    correct_answer: string;
    position: number;
  }) => void;
  onCancel: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  initialData,
  defaultPosition,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [question, setQuestion] = useState(initialData?.question ?? "");
  const [correctAnswer, setCorrectAnswer] = useState(
    initialData?.correct_answer ?? "",
  );
  const [position, setPosition] = useState(
    initialData?.position ?? defaultPosition,
  );

  const isEditMode = Boolean(initialData);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim() || !correctAnswer.trim()) return;
    onSubmit({
      question: question.trim(),
      correct_answer: correctAnswer.trim(),
      position,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">
          {isEditMode ? t("admin.editTask") : t("admin.addTask")}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("admin.question")}
            </span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={2}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("admin.correctAnswer")}
            </span>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("admin.position")}
            </span>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              min={0}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
