import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguages } from "../hooks/useLanguages";
import { useWordsAdmin } from "../hooks/useWordsAdmin";
import {
  useCreateWordAdminMutation,
  useUpdateWordAdmin,
  useDeleteWordAdmin,
} from "../hooks/useWordAdminMutations";
import { firstImageUrl } from "../hooks/useWordDetails";
import { WordFormModal } from "../components/WordFormModal";
import { WordMediaModal } from "../components/WordMediaModal";
import type { Word, WordId } from "../types";

export const WordsAdminPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: languages } = useLanguages();

  const [languageFilter, setLanguageFilter] = useState<number | "">("");
  const [search, setSearch] = useState("");

  const { data: words, isLoading, isError } = useWordsAdmin(
    languageFilter === "" ? undefined : languageFilter,
    search,
  );

  const createWord = useCreateWordAdminMutation();
  const updateWord = useUpdateWordAdmin();
  const deleteWord = useDeleteWordAdmin();

  const [modalMode, setModalMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [mediaWordId, setMediaWordId] = useState<WordId | null>(null);

  const openCreate = () => {
    setEditingWord(null);
    setModalMode("create");
  };

  const openEdit = (word: Word) => {
    setEditingWord(word);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode("none");
    setEditingWord(null);
  };

  const handleSubmit = (data: { text: string; language_id: number }) => {
    if (modalMode === "create") {
      createWord.mutate(data, { onSuccess: closeModal });
    } else if (modalMode === "edit" && editingWord?.word_id) {
      updateWord.mutate(
        { wordId: editingWord.word_id, payload: { text: data.text } },
        { onSuccess: closeModal },
      );
    }
  };

  const handleDelete = (word: Word) => {
    if (!word.word_id) return;
    const confirmed = window.confirm(
      t("admin.confirmDeleteWord", { text: word.text ?? "" }),
    );
    if (confirmed) {
      deleteWord.mutate(word.word_id);
    }
  };

  const isSubmitting = createWord.isPending || updateWord.isPending;
  const submitError =
    createWord.isError || updateWord.isError ? t("common.error") : null;

  const mediaWord = words?.find((w) => w.word_id === mediaWordId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {t("admin.wordsTitle")}
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + {t("admin.addWord")}
        </button>
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.searchWordPlaceholder")}
          className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
        />
        <select
          value={languageFilter}
          onChange={(e) =>
            setLanguageFilter(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
        >
          <option value="">{t("admin.allLanguages")}</option>
          {languages?.map((lang) => (
            // <option key={lang.app_language_id} value={lang.app_language_id}>
            <option key={lang.id} value={lang.id}>

              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-slate-500">{t("common.loading")}</p>}
      {isError && <p className="text-red-600">{t("common.error")}</p>}

      {!isLoading && !isError && (
        <>
          {words && words.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {words.map((word) => {
                const imageUrl = firstImageUrl(word);
                return (
                  <li
                    key={word.word_id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg" aria-hidden="true">
                            🖼️
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-slate-800">
                        {word.text}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => word.word_id && setMediaWordId(word.word_id)}
                        className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                      >
                        {t("admin.mediaButton")}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(word)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(word)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500">{t("admin.noWords")}</p>
          )}
        </>
      )}

      {modalMode !== "none" && (
        <WordFormModal
          initialData={editingWord ?? undefined}
          isSubmitting={isSubmitting}
          errorMessage={submitError}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}

      {mediaWordId && mediaWord && (
        <WordMediaModal
          wordId={mediaWordId}
          wordText={mediaWord.text ?? ""}
          onClose={() => setMediaWordId(null)}
        />
      )}
    </div>
  );
};

export default WordsAdminPage;
