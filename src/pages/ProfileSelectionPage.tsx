import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChildren } from "../hooks/useChildren";
import { useAuth } from "../hooks/useAuth";
import { AvatarButton } from "../components/AvatarButton";

export const ProfileSelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const navigate = useNavigate();
  const { data: children, isLoading, isError } = useChildren();

  // Admins landen technisch auch auf /dashboard (gemeinsame Route für alle
  // authentifizierten Nutzer), fachlich gehört ihr Bereich aber nach
  // /admin/overview - direkt dorthin weiterleiten statt einen Platzhalter zu zeigen.
  if (role === "admin") {
    return <Navigate to="/admin/overview" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-amber-50 p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        {t("children.whoIsLearning")}
      </h1>
      <p className="mt-1 text-slate-500">{t("children.tapYourPicture")}</p>

      {isLoading && (
        <p className="mt-10 text-slate-500">{t("common.loading")}</p>
      )}

      {isError && (
        <p className="mt-10 text-red-600">{t("common.error")}</p>
      )}

      {!isLoading && !isError && (
        <>
          {children && children.length > 0 ? (
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {children.map((child) => (
                <AvatarButton
                  key={child.child_id}
                  label={child.nickname ?? "?"}
                  imageUrl={child.avatar}
                  onClick={() => navigate(`/children/${child.child_id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-slate-500">{t("children.empty")}</p>
          )}

          <button
            type="button"
            onClick={() => navigate("/children")}
            className="mx-auto mt-8 flex w-full max-w-xs flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 py-4 text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            <span className="text-lg font-medium">+ {t("children.add")}</span>
            <span className="text-xs">({t("children.guardiansOnly")})</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileSelectionPage;

