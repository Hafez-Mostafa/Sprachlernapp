import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useExerciseAdmin } from "../hooks/useExerciseAdmin";
import { useTasksAdmin } from "../hooks/useTasksAdmin";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTaskAdminMutations";
import { TaskFormModal } from "../components/TaskFormModal";
import { TaskWordLinker } from "../components/TaskWordLinker";
import type { Task, exerciseId as ExerciseIdType, TaskId } from "../types";

export const TasksAdminPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { exerciseId } = useParams<{ exerciseId: string }>();

  const { data: exercise } = useExerciseAdmin(exerciseId as ExerciseIdType);
  const { data: tasks, isLoading, isError } = useTasksAdmin(
    exerciseId as ExerciseIdType,
  );

  const createTask = useCreateTask(exerciseId as ExerciseIdType);
  const updateTask = useUpdateTask(exerciseId as ExerciseIdType);
  const deleteTask = useDeleteTask(exerciseId as ExerciseIdType);

  const [modalMode, setModalMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [linkingTaskId, setLinkingTaskId] = useState<TaskId | null>(null);

  const openCreate = () => {
    setEditingTask(null);
    setModalMode("create");
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode("none");
    setEditingTask(null);
  };

  const handleSubmit = (data: {
    question: string;
    correct_answer: string;
    position: number;
  }) => {
    if (modalMode === "create") {
      createTask.mutate(data, { onSuccess: closeModal });
    } else if (modalMode === "edit" && editingTask?.task_id) {
      updateTask.mutate(
        { taskId: editingTask.task_id, payload: data },
        { onSuccess: closeModal },
      );
    }
  };

  const handleDelete = (task: Task) => {
    if (!task.task_id) return;
    const confirmed = window.confirm(
      t("admin.confirmDeleteTask", { question: task.question ?? "" }),
    );
    if (confirmed) {
      deleteTask.mutate(task.task_id);
    }
  };

  const isSubmitting = createTask.isPending || updateTask.isPending;
  const submitError =
    createTask.isError || updateTask.isError ? t("common.error") : null;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate("/admin/exercises")}
        className="mb-4 text-sm font-medium text-indigo-600 hover:underline"
      >
        ← {t("admin.exercisesTitle")}
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t("admin.tasksTitle")}
          </h1>
          {exercise?.title && (
            <p className="text-sm text-slate-500">{exercise.title}</p>
          )}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + {t("admin.addTask")}
        </button>
      </div>

      {isLoading && <p className="text-slate-500">{t("common.loading")}</p>}
      {isError && <p className="text-red-600">{t("common.error")}</p>}

      {!isLoading && !isError && (
        <>
          {tasks && tasks.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {tasks
                .slice()
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .map((task) => (
                  <li
                    key={task.task_id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {task.question}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {t("admin.correctAnswer")}: {task.correct_answer}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        #{task.position}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => task.task_id && setLinkingTaskId(task.task_id)}
                        className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                      >
                        {t("admin.linkWords")}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(task)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-slate-500">{t("admin.noTasks")}</p>
          )}
        </>
      )}

      {modalMode !== "none" && (
        <TaskFormModal
          initialData={editingTask ?? undefined}
          defaultPosition={(tasks?.length ?? 0) + 1}
          isSubmitting={isSubmitting}
          errorMessage={submitError}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}

      {linkingTaskId && exercise?.language_id !== undefined && (
        <TaskWordLinker
          taskId={linkingTaskId}
          languageId={exercise.language_id}
          onClose={() => setLinkingTaskId(null)}
        />
      )}
    </div>
  );
};

export default TasksAdminPage;
