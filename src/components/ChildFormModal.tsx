import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ChildProfile } from "../types";
import { useLanguages } from "../hooks/useLanguages";

interface ChildFormModalProps {
  initialData?: ChildProfile; // vorhanden = Bearbeiten-Modus, sonst Anlegen
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (data: { nickname: string; avatar?: string; language_id: number }) => void;
  onCancel: () => void;
}

export const ChildFormModal: React.FC<ChildFormModalProps> = ({
  initialData,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { data: languages, isLoading: isLoadingLanguages } = useLanguages();

  const [nickname, setNickname] = useState(initialData?.nickname ?? "");
  const [avatar, setAvatar] = useState(initialData?.avatar ?? "");
  const [languageId, setLanguageId] = useState<number | "">(
    initialData?.language_id ?? "",
  );

  const isEditMode = Boolean(initialData);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nickname.trim() || languageId === "") return;
    onSubmit({
      nickname: nickname.trim(),
      avatar: avatar.trim() || undefined,
      language_id: languageId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">
          {isEditMode ? t("children.editTitle") : t("children.addTitle")}
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
              {t("children.nickname")}
            </span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
                <option key={lang.app_language_id} value={lang.app_language_id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("children.avatar")} ({t("children.optional")})
            </span>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
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
