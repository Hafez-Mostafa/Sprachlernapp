import React from "react";
import { useTranslation } from "react-i18next";

interface ContinueLearningBannerProps {
  exerciseTitle: string;
  onStart: () => void;
}

export const ContinueLearningBanner: React.FC<ContinueLearningBannerProps> = ({
  exerciseTitle,
  onStart,
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-5 text-white">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-100">
        {t("dashboard.continueLearning")}
      </p>
      <p className="mt-1 text-lg font-semibold">{exerciseTitle}</p>
      <button
        type="button"
        onClick={onStart}
        className="mt-3 rounded-xl bg-amber-400 px-5 py-2 text-sm font-bold text-slate-900 transition hover:bg-amber-300"
      >
        {t("dashboard.start")}
      </button>
    </div>
  );
};
