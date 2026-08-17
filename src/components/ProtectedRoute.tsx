import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/* Wrapper-Komponente für geschützte Routen. 
 * Beispielsyntax in deinen Routen:
 * <ProtectedRoute allowedRoles={["admin"]}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  // 1. Solange der AuthContext noch das Token prüft: Lade-Screen anzeigen
  if (isLoading) {
    return <div>Aktivität wird geprüft...</div>;
  }

  // 2. Nicht eingeloggt -> Zur Login-Seite leiten (inkl. Ziel-URL als State)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Eingeloggt, aber falsche Rolle (z. B. Guardian versucht Admin-Seite zu öffnen)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Alles gültig -> Die geschützte Seite wird gerendert
  return <>{children}</>;
};











