import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

interface LocationState {
  from?: { pathname: string };
}

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { loginGuardian, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dsgvoAccepted, setDsgvoAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState | null;
  const fromPath = state?.from?.pathname;
  const redirectTo = fromPath ?? "/dashboard";

  // Fix: Falls ProtectedRoute hierher umgeleitet hat, weil eigentlich eine
  // Admin-Route (z.B. /admin/overview) aufgerufen wurde, gehört hier NICHT
  // das Guardian-Formular gezeigt - stattdessen sofort zur echten
  // Admin-Login-Seite weiterleiten, mit demselben Redirect-Ziel im State.
  React.useEffect(() => {
    if (fromPath?.startsWith("/admin")) {
      navigate("/admin/login", { replace: true, state: { from: state?.from } });
    }
  }, [fromPath, navigate, state]);

  // Bereits eingeloggt (z.B. Reload auf /login) -> direkt weiterleiten
  React.useEffect(() => {
    if (isAuthenticated && !fromPath?.startsWith("/admin")) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo, fromPath]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!dsgvoAccepted) {
      setError(t("auth.dsgvoRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await loginGuardian({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError(t("auth.invalidCredentials"));
      } else {
        setError(t("common.error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Während der Weiterleitung zu /admin/login (siehe Effect oben) nichts rendern,
  // damit das Guardian-Formular nicht kurz aufblitzt
  if (fromPath?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header mit Farbverlauf, Titel und Sprachauswahl */}
      <header className="flex items-center justify-between bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white shadow-sm">
        <span className="text-lg font-semibold">{t("app.name")}</span>
        <LanguageSwitcher variant="onDark" />
      </header>

      {/* Formular-Bereich */}
      <div className="flex flex-1 justify-center px-5 py-10">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-4"
          noValidate
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("auth.welcomeTitle")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("auth.subtitle")}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-100 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("auth.email")}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {t("auth.password")}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </label>

          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={dsgvoAccepted}
              onChange={(e) => {
                setDsgvoAccepted(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>{t("auth.dsgvoLabel")}</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("common.loading") : t("auth.loginButton")}
          </button>

          <Link
            to="/register"
            className="w-full rounded-xl border-2 border-indigo-600 py-3 text-center text-base font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
          >
            {t("auth.createAccountButton")}
          </Link>

          <Link
            to="/admin/login"
            className="text-center text-xs font-medium text-slate-400 hover:text-slate-600 hover:underline"
          >
            {t("admin.loginLinkLabel")}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
