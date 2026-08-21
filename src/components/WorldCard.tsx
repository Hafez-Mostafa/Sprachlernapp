import React from "react";

interface WorldCardProps {
  title: string;
  colorIndex: number;
  onClick: () => void;
}

// Zyklische Farbpalette für die Welt-Kacheln, da es (noch) keine
// eigene Kategorie-Entität mit fester Farbe im Backend gibt.
const COLOR_VARIANTS = [
  { bar: "bg-rose-400", bg: "bg-rose-50" },
  { bar: "bg-emerald-400", bg: "bg-emerald-50" },
  { bar: "bg-red-400", bg: "bg-red-50" },
  { bar: "bg-sky-400", bg: "bg-sky-50" },
  { bar: "bg-amber-400", bg: "bg-amber-50" },
  { bar: "bg-violet-400", bg: "bg-violet-50" },
];

export const WorldCard: React.FC<WorldCardProps> = ({
  title,
  colorIndex,
  onClick,
}) => {
  const variant = COLOR_VARIANTS[colorIndex % COLOR_VARIANTS.length];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col overflow-hidden rounded-2xl text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${variant.bg}`}
    >
      <div className="px-4 pb-3 pt-4">
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      <div className={`h-1.5 w-full ${variant.bar}`} />
    </button>
  );
};
