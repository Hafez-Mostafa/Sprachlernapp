import React from "react";
import { useTranslation } from "react-i18next";

type FeedbackBannerProps =
  | {
      variant: "correct";
      points?: number;
      onContinue: () => void;
      onListenPronunciation?: () => void;
    }
  | {
      variant: "retry";
      onRetry: () => void;
    }
  | {
      variant: "solution";
      solutionText: string;
      onListenAndContinue: () => void;
    };

export const FeedbackBanner: React.FC<FeedbackBannerProps> = (props) => {
  const { t } = useTranslation();

  if (props.variant === "correct") {
    return (
      <div className="rounded-2xl bg-emerald-500 p-5 text-white shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            ⭐
          </span>
          <div>
            <p className="font-bold">{t("exercise.correct")}</p>
            {typeof props.points === "number" && (
              <p className="text-sm text-emerald-100">
                +{props.points} {t("exercise.pointsForYou")}
              </p>
            )}
          </div>
        </div>

        {props.onListenPronunciation && (
          <button
            type="button"
            onClick={props.onListenPronunciation}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400/40 py-2 text-sm font-medium text-white transition hover:bg-emerald-400/60"
          >
            {t("exercise.practicePronunciation")}
          </button>
        )}

        <button
          type="button"
          onClick={props.onContinue}
          className="mt-3 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
        >
          {t("exercise.nextTask")} →
        </button>
      </div>
    );
  }

  if (props.variant === "retry") {
    return (
      <div className="rounded-2xl bg-amber-500 p-5 text-white shadow-md">
        <p className="font-bold">{t("exercise.incorrectFirstTry")}</p>
        <button
          type="button"
          onClick={props.onRetry}
          className="mt-3 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-50"
        >
          {t("exercise.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-red-500 p-5 text-white shadow-md">
      <p className="font-bold">{t("exercise.hereIsTheSolution")}</p>
      <p className="mt-1 text-sm text-red-100">{props.solutionText}</p>
      <button
        type="button"
        onClick={props.onListenAndContinue}
        className="mt-3 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50"
      >
        {t("exercise.listenSolutionAndContinue")}
      </button>
    </div>
  );
};
