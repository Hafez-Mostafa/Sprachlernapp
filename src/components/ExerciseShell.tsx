import React from "react";

// Kleine Inline-Icons statt einer zusätzlichen Icon-Library-Dependency,
// um das Projekt nicht unnötig aufzublähen (kann bei Bedarf später gegen
// lucide-react o.ä. getauscht werden).
const CloseIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SettingsIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

interface ExerciseShellProps {
  currentStep: number; // 1-basiert, für Anzeige
  totalSteps: number;
  onClose: () => void;
  onSettings?: () => void;
  children: React.ReactNode;
}

export const ExerciseShell: React.FC<ExerciseShellProps> = ({
  currentStep,
  totalSteps,
  onClose,
  onSettings,
  children,
}) => {
  const progressPercent =
    totalSteps > 0 ? Math.min(100, (currentStep / totalSteps) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col">
      {/* Header: Close, Fortschrittsbalken, Settings */}
      <div className="flex items-center gap-3 px-1 py-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <CloseIcon />
        </button>

        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <button
          type="button"
          onClick={onSettings}
          aria-label="Einstellungen"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <SettingsIcon />
        </button>
      </div>

      {/* Aufgaben-Inhalt */}
      <div className="flex flex-1 flex-col items-center justify-center px-2 py-6">
        {children}
      </div>
    </div>
  );
};
