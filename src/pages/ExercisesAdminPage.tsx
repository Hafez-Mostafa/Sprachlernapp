import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useExercisesAdmin } from "../hooks/useExercisesAdmin";

import { useCreateExercise, useDeleteExercise, useUpdateExercise } from "../hooks/useExerciseAdminMutations";
import type { Exercise } from "../types";
import { ExerciseFormModal } from "../components/ExerciseFormModal";
import { EXERCISE_TYPE_ID } from "../constants/exerciseType";


const typeLabel = (typeId?: number, t?: (key: string) => string): string => {
  if (!t) return "";
  if (typeId === EXERCISE_TYPE_ID.MULTIPLE_CHOICE) return t("admin.typeMultipleChoice");
  if (typeId === EXERCISE_TYPE_ID.MATCHING) return t("admin.typeMatching");
  if (typeId === EXERCISE_TYPE_ID.TEXT_INPUT) return t("admin.typeTextInput");
  return "?";
};

export const ExercisesAdminPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: exercises, isLoading, isError } = useExercisesAdmin();

  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();

  const [modalMode, setModalMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(
    null,
  );

  const openCreate = () => {
    setEditingExercise(null);
    setModalMode("create");
  };

  const openEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode("none");
    setEditingExercise(null);
  };

  const handleSubmit = (data: {
    title: string;
    language_id: number;
    exercise_type_id: number;
    is_active: boolean;
  }) => {
    if (modalMode === "create") {
      createExercise.mutate(data, { onSuccess: closeModal });
    } else if (modalMode === "edit" && editingExercise?.exercise_id) {
      updateExercise.mutate(
        { id: editingExercise.exercise_id, payload: data },
        { onSuccess: closeModal },
      );
    }
  };

  const handleDelete = (exercise: Exercise) => {
    if (!exercise.exercise_id) return;
    const confirmed = window.confirm(
      t("admin.confirmDeleteExercise", { title: exercise.title ?? "" }),
    );
    if (confirmed) {
      deleteExercise.mutate(exercise.exercise_id);
    }
  };

  const isSubmitting = createExercise.isPending || updateExercise.isPending;
  const submitError =
    createExercise.isError || updateExercise.isError
      ? t("common.error")
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {t("admin.exercisesTitle")}
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + {t("admin.addExercise")}
        </button>
      </div>

      {isLoading && <p className="text-slate-500">{t("common.loading")}</p>}
      {isError && <p className="text-red-600">{t("common.error")}</p>}

      {!isLoading && !isError && (
        <>
          {exercises && exercises.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {exercises.map((exercise) => (
                <li
                  key={exercise.exercise_id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {exercise.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {typeLabel(exercise.exercise_type_id, t)} ·{" "}
                      {exercise.is_active
                        ? t("admin.active")
                        : t("admin.inactive")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/exercises/${exercise.exercise_id}/tasks`)
                      }
                      className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                    >
                      {t("admin.manageTasks")}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(exercise)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(exercise)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">{t("admin.noExercises")}</p>
          )}
        </>
      )}

      {modalMode !== "none" && (
        <ExerciseFormModal
          initialData={editingExercise ?? undefined}
          isSubmitting={isSubmitting}
          errorMessage={submitError}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default ExercisesAdminPage;
