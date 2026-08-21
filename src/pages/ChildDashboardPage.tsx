import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChild } from "../hooks/useChild";
import { useExercises } from "../hooks/Useexercises"
import { WorldCard } from "../components/WorldCard";
import { ContinueLearningBanner } from "../components/ContinueLearningBanner";
import type { ChildId } from "../types";

export const ChildDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();

  const { data: child, isLoading: isChildLoading } = useChild(
    childId as ChildId,
  );
  const {
    data: exercises,
    isLoading: isExercisesLoading,
    isError,
  } = useExercises(child?.language_id);

  const isLoading = isChildLoading || isExercisesLoading;

  // MVP-Vereinfachung: "Weiterlernen" zeigt die erste verfügbare Übung.
  // Für eine echte "zuletzt unvollständige Übung"-Logik bräuchten wir
  // LearningProgress (nach task_id) mit den Tasks jeder Exercise verknüpft -
  // heben wir uns für einen späteren Schritt auf, wenn echte Fortschrittsdaten da sind.
  const recommendedExercise = exercises?.[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Kopfzeile mit Kind-Info */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
          {child?.nickname?.charAt(0).toUpperCase() ?? "?"}
        </span>
        <span className="text-lg font-semibold text-slate-900">
          {child?.nickname}
        </span>
      </div>

      {isLoading && <p className="text-slate-500">{t("common.loading")}</p>}
      {isError && <p className="text-red-600">{t("common.error")}</p>}

      {!isLoading && !isError && (
        <>
          {recommendedExercise && (
            <ContinueLearningBanner
              exerciseTitle={recommendedExercise.title ?? ""}
              onStart={() =>
                navigate(`/exercises/${recommendedExercise.exercise_id}`)
              }
            />
          )}

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-600">
              {t("dashboard.yourWorlds")}
            </h2>
            {exercises && exercises.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {exercises.map((exercise, index) => (
                  <WorldCard
                    key={exercise.exercise_id}
                    title={exercise.title ?? ""}
                    colorIndex={index}
                    onClick={() =>
                      navigate(`/exercises/${exercise.exercise_id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500">{t("dashboard.noExercises")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChildDashboardPage;
