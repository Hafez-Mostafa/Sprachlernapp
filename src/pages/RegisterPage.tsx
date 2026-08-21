import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { guardianService } from "../services/guardian.service";
import { useAuth } from "../hooks/useAuth";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const { loginGuardian } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError(t("auth.passwordMismatch"));
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Guardian-Konto anlegen (POST /guardians)
            await guardianService.register({ email, password });

            // 2. Direkt einloggen mit den gerade verwendeten Zugangsdaten,
            //    damit der Nutzer nicht erneut manuell anmelden muss
            await loginGuardian({ email, password });

            navigate("/dashboard", { replace: true });
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError(t("auth.emailAlreadyRegistered"));
                } else if (err.response?.status === 400) {
                    setError(t("auth.registrationValidationError"));
                } else {
                    setError(t("common.error"));
                }
            } else {
                setError(t("common.error"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Header, konsistent mit LoginPage */}
            <header className="flex items-center justify-between bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white shadow-sm">
                <span className="text-lg font-semibold">{t("app.name")}</span>
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
                            {t("auth.registerTitle")}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">{t("auth.subtitle")}</p>
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
                            autoComplete="email"
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
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700">
                            {t("auth.confirmPassword")}
                        </span>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? t("common.loading") : t("auth.registerButton")}
                    </button>

                    <Link
                        to="/login"
                        className="text-center text-sm font-medium text-indigo-600 hover:underline"
                    >
                        {t("auth.backToLogin")}
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
