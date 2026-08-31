import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguages } from "../hooks/useLanguages";
import { EXERCISE_TYPE_ID } from "../constants/exerciseType";
import type { Exercise } from "../types";

interface ExerciseFormModalProps {
  initialData?: Exercise;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (data: {
    title: string;
    language_id: number;
    exercise_type_id: number;
    is_active: boolean;
  }) => void;
  onCancel: () => void;
}

const EXERCISE_TYPE_OPTIONS = [
  { id: EXERCISE_TYPE_ID.MULTIPLE_CHOICE, labelKey: "admin.typeMultipleChoice" },
  { id: EXERCISE_TYPE_ID.MATCHING, labelKey: "admin.typeMatching" },
  { id: EXERCISE_TYPE_ID.TEXT_INPUT, labelKey: "admin.typeTextInput" },
];

export const ExerciseFormModal: React.FC<ExerciseFormModalProps> = ({
  initialData,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { data: languages, isLoading: isLoadingLanguages } = useLanguages();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [languageId, setLanguageId] = useState<number | "">(
    initialData?.language_id ?? "",
  );
  const [exerciseTypeId, setExerciseTypeId] = useState<number | "">(
    initialData?.exercise_type_id ?? "",
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const isEditMode = Boolean(initialData);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !title.trim() ||
      languageId === "" ||
      Number.isNaN(languageId) ||
      exerciseTypeId === "" ||
      Number.isNaN(exerciseTypeId)
    ) {
      return;
    }
    onSubmit({
      title: title.trim(),
      language_id: languageId,
      exercise_type_id: exerciseTypeId,
      is_active: isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">
          {isEditMode ? t("admin.editExercise") : t("admin.addExercise")}
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
              {t("admin.exerciseTitle")}
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("children.language")}
            </span>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
              required
              disabled={isLoadingLanguages}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="" disabled>
                {t("children.selectLanguage")}
              </option>
              {languages?.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("admin.exerciseType")}
            </span>
            <select
              value={exerciseTypeId}
              onChange={(e) => setExerciseTypeId(Number(e.target.value))}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="" disabled>
                {t("admin.selectType")}
              </option>
              {EXERCISE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            {t("admin.isActive")}
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
