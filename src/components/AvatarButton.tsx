import React from "react";

interface AvatarButtonProps {
  label: string;
  imageUrl?: string;
  onClick: () => void;
}

// Deterministische Farbzuordnung anhand des ersten Buchstabens,
// damit jedes Kind immer die gleiche Farbe bekommt (kein Zufall bei jedem Render)
const FALLBACK_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
];

const colorForLabel = (label: string): string => {
  const index = label.charCodeAt(0) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index] ?? FALLBACK_COLORS[0];
};

export const AvatarButton: React.FC<AvatarButtonProps> = ({
  label,
  imageUrl,
  onClick,
}) => {
  const initial = label.trim().charAt(0).toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl p-3 transition hover:scale-105 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <span
        className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-2xl font-bold shadow-sm ${
          imageUrl ? "bg-slate-100" : colorForLabel(label)
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </span>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
    </button>
  );
};
