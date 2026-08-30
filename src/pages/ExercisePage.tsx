import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExercise } from "../hooks/useExercise";
import { useExerciseTasks } from "../hooks/useExerciseTasks";
import { useTask } from "../hooks/useTask";
import { ExerciseShell } from "../components/ExerciseShell";
import { FeedbackBanner } from "../components/FeedbackBanner";
import { MultipleChoiceExercise } from "../components/MultipleChoiceExercise";
import { MatchingExercise } from "../components/MatchingExercise";
import { SpellingExercise } from "../components/SpellingExercise";
import { taskService } from "../services/task.service";
import { EXERCISE_TYPE_ID } from "../constants/exerciseType";
import type { Word, exerciseId as ExerciseIdType, TaskId } from "../types";

type Phase = "answering" | "correct" | "retry" | "solution";

export const ExercisePage: React.FC = () => {
  const { childId, exerciseId } = useParams<{
    childId: string;
    exerciseId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: exercise,
    isLoading: isExerciseLoading,
    isError: isExerciseError,
  } = useExercise(exerciseId as ExerciseIdType);
  const {
    data: tasks,
    isLoading: areTasksLoading,
    isError: areTasksError,
  } = useExerciseTasks(exerciseId as ExerciseIdType);

  const [taskIndex, setTaskIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [attempt, setAttempt] = useState(1);

  const currentTaskSummary = tasks?.[taskIndex];
  const {
    data: task,
    isLoading: isTaskLoading,
    isError: isTaskError,
  } = useTask(currentTaskSummary?.task_id as TaskId);

  const totalTasks = tasks?.length ?? 0;
  const isLoading =
    isExerciseLoading ||
    areTasksLoading ||
    (Boolean(currentTaskSummary) && isTaskLoading);

  const goToDashboard = () => navigate(`/children/${childId}`);

  const handleSubmit = (isCorrect: boolean, answerText: string) => {
    // Serverseitig persistieren - blockiert die UI-Reaktion nicht,
    // Fehler werden geloggt statt den Lernfluss zu unterbrechen
    if (childId && currentTaskSummary?.task_id) {
      taskService
        .submitAnswer(currentTaskSummary.task_id, {
          child_id: childId,
          answer: answerText,
        })
        .catch((err) =>
          console.warn("Fortschritt konnte nicht gespeichert werden:", err),
        );
    }

    if (isCorrect) {
      setPhase("correct");
    } else if (attempt === 1) {
      setPhase("retry");
    } else {
      setPhase("solution");
    }
  };

  const handleRetry = () => {
    setAttempt(2);
    setPhase("answering");
  };

  const handleNext = () => {
    if (taskIndex + 1 < totalTasks) {
      setTaskIndex((i) => i + 1);
      setAttempt(1);
      setPhase("answering");
    } else {
      goToDashboard();
    }
  };

  if (isExerciseError || areTasksError || isTaskError) {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-red-600">
        Die Übung konnte nicht geladen werden. Bitte versuche es später erneut.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-slate-500">
        Wird geladen…
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-slate-500">
        Diese Übung konnte nicht gefunden werden.
      </div>
    );
  }

  if (!tasks || totalTasks === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-slate-500">
        Für diese Übung sind noch keine Aufgaben vorhanden.
      </div>
    );
  }

  if (!currentTaskSummary || !task) {
    return (
      <div className="mx-auto max-w-md py-16 text-center text-slate-500">
        Die aktuelle Aufgabe konnte nicht geladen werden.
      </div>
    );
  }

  const words: Word[] =
    task.words?.map((w) => w.word).filter((w): w is Word => Boolean(w)) ?? [];

  return (
    <ExerciseShell
      currentStep={taskIndex + 1}
      totalSteps={totalTasks}
      onClose={goToDashboard}
    >
      {phase === "answering" && (
        <>
          {exercise.exercise_type_id === EXERCISE_TYPE_ID.MULTIPLE_CHOICE && (
            <MultipleChoiceExercise
              key={`${task.task_id}-${attempt}`}
              correctAnswer={task.correct_answer ?? ""}
              words={words}
              languageId={exercise.language_id}
              onSubmit={handleSubmit}
            />
          )}
          {exercise.exercise_type_id === EXERCISE_TYPE_ID.MATCHING && (
            <MatchingExercise
              key={`${task.task_id}-${attempt}`}
              words={words}
              onSubmit={handleSubmit}
              onSkip={handleNext}
            />
          )}
          {exercise.exercise_type_id === EXERCISE_TYPE_ID.TEXT_INPUT && (
            <SpellingExercise
              key={`${task.task_id}-${attempt}`}
              correctAnswer={task.correct_answer ?? ""}
              words={words}
              onSubmit={handleSubmit}
            />
          )}
        </>
      )}

      {phase === "correct" && (
        <FeedbackBanner variant="correct" onContinue={handleNext} />
      )}
      {phase === "retry" && (
        <FeedbackBanner variant="retry" onRetry={handleRetry} />
      )}
      {phase === "solution" && (
        <FeedbackBanner
          variant="solution"
          solutionText={task.correct_answer ?? ""}
          onListenAndContinue={handleNext}
        />
      )}
    </ExerciseShell>
  );
};

export default ExercisePage;
