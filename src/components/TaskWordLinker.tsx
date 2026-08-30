import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useTaskWords,
  useAddWordToTask,
  useRemoveWordFromTask,
} from "../hooks/useTaskWords";
import { useWordSearchAdmin, useCreateWordAdmin } from "../hooks/useWordSearchAdmin";
import type { TaskId } from "../types";

interface TaskWordLinkerProps {
  taskId: TaskId;
  languageId: number;
  onClose: () => void;
}

export const TaskWordLinker: React.FC<TaskWordLinkerProps> = ({
  taskId,
  languageId,
  onClose,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data: linkedWords, isLoading: isLoadingLinked } = useTaskWords(taskId);
  const { data: searchResults, isLoading: isSearching } = useWordSearchAdmin(
    languageId,
    search,
  );

  const addWord = useAddWordToTask(taskId);
  const removeWord = useRemoveWordFromTask(taskId);
  const createWord = useCreateWordAdmin();

  const linkedWordIds = new Set(
    linkedWords?.map((entry) => entry.word?.word_id).filter(Boolean),
  );

  const handleAdd = (wordId: string) => {
    const nextPosition = (linkedWords?.length ?? 0) + 1;
    addWord.mutate({ wordId, position: nextPosition });
  };

  const handleCreateAndAdd = () => {
    if (!search.trim()) return;
    createWord.mutate(
      { text: search.trim(), language_id: languageId },
      {
        onSuccess: (newWord) => {
          if (newWord.word_id) {
            handleAdd(newWord.word_id);
          }
          setSearch("");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">
          {t("admin.linkWords")}
        </h2>

        {/* Verknüpfte Wörter */}
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-600">
            {t("admin.linkedWords")}
          </p>
          {isLoadingLinked && (
            <p className="mt-2 text-sm text-slate-400">{t("common.loading")}</p>
          )}
          {linkedWords && linkedWords.length === 0 && !isLoadingLinked && (
            <p className="mt-2 text-sm text-slate-400">
              {t("admin.noLinkedWords")}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {linkedWords?.map((entry) => (
              <span
                key={entry.word?.word_id}
                className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
              >
                {entry.word?.text}
                <button
                  type="button"
                  onClick={() =>
                    entry.word?.word_id &&
                    removeWord.mutate(entry.word.word_id)
                  }
                  aria-label={t("common.delete")}
                  className="text-indigo-400 hover:text-indigo-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Suche + Neu anlegen */}
        <div className="mt-5 flex-1 overflow-y-auto">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600">
              {t("admin.searchOrCreateWord")}
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.searchWordPlaceholder")}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          {isSearching && (
            <p className="mt-2 text-sm text-slate-400">{t("common.loading")}</p>
          )}

          <ul className="mt-2 flex flex-col gap-1.5">
            {searchResults
              ?.filter((word) => !linkedWordIds.has(word.word_id))
              .map((word) => (
                <li key={word.word_id}>
                  <button
                    type="button"
                    onClick={() => word.word_id && handleAdd(word.word_id)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    + {word.text}
                  </button>
                </li>
              ))}
          </ul>

          {search.trim() &&
            searchResults?.every((w) => w.text !== search.trim()) && (
              <button
                type="button"
                onClick={handleCreateAndAdd}
                disabled={createWord.isPending}
                className="mt-2 w-full rounded-lg border border-dashed border-indigo-300 px-3 py-2 text-left text-sm text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-60"
              >
                {t("admin.createAndLinkWord", { text: search.trim() })}
              </button>
            )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {t("common.back")}
        </button>
      </div>
    </div>
  );
};
