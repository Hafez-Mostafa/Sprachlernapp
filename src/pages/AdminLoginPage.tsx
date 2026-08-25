import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

interface LocationState {
  from?: { pathname: string };
}

export const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { loginAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? "/admin/overview";

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await loginAdmin({ email, password });
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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between bg-linear-to-r from-slate-800 to-slate-950 px-5 py-4 text-white shadow-sm">
        <span className="text-lg font-semibold">
          {t("app.name")} — {t("admin.dashboardTitle")}
        </span>
        <LanguageSwitcher variant="onDark" />
      </header>

      <div className="flex flex-1 justify-center px-5 py-10">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-4"
          noValidate
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("admin.loginTitle")}
            </h1>
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
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none transition focus:border-slate-800 focus:ring-2 focus:ring-slate-800/20"
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
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none transition focus:border-slate-800 focus:ring-2 focus:ring-slate-800/20"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-slate-900 py-3 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("common.loading") : t("auth.loginButton")}
          </button>

          <Link
            to="/login"
            className="text-center text-sm font-medium text-slate-500 hover:underline"
          >
            {t("admin.backToGuardianLogin")}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
