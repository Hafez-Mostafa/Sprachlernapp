import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

/**
 * Das globale App-Layout für angemeldete Nutzer.
 * Enthalten: Navigationsleiste, Benutzer-Info, Logout-Button und Inhaltsbereich (<Outlet />).
 */
export const MainLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigationsleiste / Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/dashboard"
            className="text-slate-600 transition hover:text-indigo-600"
          >
            {t("nav.dashboard")}
          </Link>
          {role === "guardian" && (
            <Link
              to="/children"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              {t("nav.children")}
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/admin/overview"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            {t("auth.loggedInAs", { email: user?.email })} ({role})
          </span>
          <LanguageSwitcher />
          <button
            onClick={logout}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            {t("nav.logout")}
          </button>
        </div>
      </header>

      {/* Haupt-Inhaltsbereich (hier werden die Seiten gerendert) */}
      <main className="flex-1 bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};
