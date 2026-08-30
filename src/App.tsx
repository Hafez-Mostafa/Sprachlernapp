import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { AuthProvider } from "./context/AuthContext";
import { MainLayout } from "./components/MainLayout";
import { useDocumentDirection } from "./hooks/useDocumentDirection";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { ProfileSelectionPage } from "./pages/ProfileSelectionPage";
import { ChildDashboardPage } from "./pages/ChildDashboardPage";
import { ChildrenManagementPage } from "./pages/ChildrenManagementPage";
import { ExercisePage } from "./pages/ExercisePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ExercisesAdminPage from "./pages/ExercisesAdminPage";
import { TasksAdminPage } from "./pages/TasksAdminPage";
import { WordsAdminPage } from "./pages/WordsAdminPage";



// Einfache Platzhalter-Seite für 403 - nutzt i18n, damit sie zur restlichen App passt
const UnauthorizedPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center px-5 text-center">
      <h2 className="text-lg font-semibold text-slate-700">
        403 — {t("common.error")}
      </h2>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Daten gelten 5 Minuten als frisch
      refetchOnWindowFocus: false, // kein Auto-Reload bei Tab-Wechsel
    },
  },
});

export const App: React.FC = () => {
  useDocumentDirection();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ---------------------------------------------------- */}
            {/* Öffentliche Routen                                    */}
            {/* ---------------------------------------------------- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* ---------------------------------------------------- */}
            {/* Geschützte Routen MIT MainLayout (Header/Nav sichtbar) */}
            {/* ---------------------------------------------------- */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Für alle angemeldeten Nutzer */}
              <Route path="/dashboard" element={<ProfileSelectionPage />} />

              {/* Guardian-spezifisch */}
              <Route
                path="/children"
                element={
                  <ProtectedRoute allowedRoles={["guardian"]}>
                    <ChildrenManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/children/:childId"
                element={
                  <ProtectedRoute allowedRoles={["guardian"]}>
                    <ChildDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin-spezifisch */}
              <Route
                path="/admin/overview"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/exercises"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ExercisesAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/words"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <WordsAdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/exercises/:exerciseId/tasks"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <TasksAdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>


            {/* ---------------------------------------------------- */}
            {/* Geschützte Route OHNE MainLayout                      */}
            {/* (ExerciseShell hat ihren eigenen Vollbild-Header)      */}
            {/* ---------------------------------------------------- */}
            <Route
              path="/children/:childId/exercises/:exerciseId"
              element={
                <ProtectedRoute allowedRoles={["guardian"]}>
                  <ExercisePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
