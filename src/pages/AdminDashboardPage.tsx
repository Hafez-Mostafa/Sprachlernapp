import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = [
    {
      key: "exercises",
      title: t("admin.exercisesTitle"),
      description: t("admin.exercisesDescription"),
      path: "/admin/exercises",
    },
    {
      key: "words",
      title: t("admin.wordsTitle"),
      description: t("admin.wordsDescription"),
      path: "/admin/words",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-slate-900">
        {t("admin.dashboardTitle")}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => navigate(section.path)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="font-semibold text-slate-800">{section.title}</p>
            <p className="mt-1 text-sm text-slate-500">
              {section.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
