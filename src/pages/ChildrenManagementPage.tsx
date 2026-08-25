import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChildren } from "../hooks/useChildren";
import {
  useCreateChild,
  useUpdateChild,
  useDeleteChild,
} from "../hooks/useChildMutations";
import { AvatarButton } from "../components/AvatarButton";
import { ChildFormModal } from "../components/ChildFormModal";
import type { ChildProfile } from "../types";

export const ChildrenManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: children, isLoading, isError } = useChildren();

  const createChild = useCreateChild();
  const updateChild = useUpdateChild();
  const deleteChild = useDeleteChild();

  const [modalMode, setModalMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  const openCreate = () => {
    setEditingChild(null);
    setModalMode("create");
  };

  const openEdit = (child: ChildProfile) => {
    setEditingChild(child);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode("none");
    setEditingChild(null);
  };

  const handleSubmit = (data: {
    nickname: string;
    avatar?: string;
    language_id: number;
  }) => {
    if (modalMode === "create") {
      createChild.mutate(data, { onSuccess: closeModal });
    } else if (modalMode === "edit" && editingChild?.child_id) {
      updateChild.mutate(
        { childId: editingChild.child_id, payload: data },
        { onSuccess: closeModal },
      );
    }
  };

  const handleDelete = (child: ChildProfile) => {
    if (!child.child_id) return;
    const confirmed = window.confirm(
      t("children.confirmDelete", { nickname: child.nickname ?? "" }),
    );
    if (confirmed) {
      deleteChild.mutate(child.child_id);
    }
  };

  const isSubmitting = createChild.isPending || updateChild.isPending;
  const submitError =
    createChild.isError || updateChild.isError ? t("common.error") : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {t("children.title")}
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + {t("children.add")}
        </button>
      </div>

      {isLoading && <p className="text-slate-500">{t("common.loading")}</p>}
      {isError && <p className="text-red-600">{t("common.error")}</p>}

      {!isLoading && !isError && (
        <>
          {children && children.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {children.map((child) => (
                <li
                  key={child.child_id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/children/${child.child_id}`)}
                    className="flex items-center gap-3 text-left"
                  >
                    <AvatarButton
                      label={child.nickname ?? "?"}
                      imageUrl={child.avatar ?? undefined}
                      onClick={() => navigate(`/children/${child.child_id}`)}
                    />
                    <span className="font-semibold text-slate-800">
                      {child.nickname}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(child)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(child)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">{t("children.empty")}</p>
          )}
        </>
      )}

      {modalMode !== "none" && (
        <ChildFormModal
          initialData={editingChild ?? undefined}
          isSubmitting={isSubmitting}
          errorMessage={submitError}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default ChildrenManagementPage;
