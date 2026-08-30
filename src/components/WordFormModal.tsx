import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguages } from "../hooks/useLanguages";
import type { Word } from "../types";

interface WordFormModalProps {
  initialData?: Word;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (data: { text: string; language_id: number }) => void;
  onCancel: () => void;
}

export const WordFormModal: React.FC<WordFormModalProps> = ({
  initialData,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { data: languages, isLoading: isLoadingLanguages } = useLanguages();

  const [text, setText] = useState(initialData?.text ?? "");
  const [languageId, setLanguageId] = useState<number | "">(
    initialData?.language_id ?? "",
  );

  const isEditMode = Boolean(initialData);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || languageId === "") return;
    onSubmit({ text: text.trim(), language_id: languageId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">
          {isEditMode ? t("admin.editWord") : t("admin.addWord")}
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
              {t("admin.wordText")}
            </span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
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
              disabled={isLoadingLanguages || isEditMode}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 disabled:bg-slate-50"
            >
              <option value="" disabled>
                {t("children.selectLanguage")}
              </option>
              {languages?.map((lang) => (
                <option key={lang.app_language_id} value={lang.app_language_id}>
                  {lang.name}
                </option>
              ))}
            </select>
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
