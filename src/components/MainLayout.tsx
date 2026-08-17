import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Das globale App-Layout für angemeldete Nutzer.
 * Enthalten: Navigationsleiste, Benutzer-Info, Logout-Button und Inhaltsbereich (<Outlet />).
 */
export const MainLayout: React.FC = () => {
  const { user, role, logout } = useAuth();

  return (
    <div className="layout-container">
      {/* 1. Navigationsleiste / Header */}
      <header style={{ display: "flex", justifyContent: "space-between", background: "#f0f0f0", padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/dashboard">Dashboard</Link>
          {role === "guardian" && <Link to="/children">Meine Kinder</Link>}
          {role === "admin" && <Link to="/admin/overview">Verwaltung</Link>}
        </nav>

        {/* User-Info & Abmelden */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>Eingeloggt als: <strong>{user?.email}</strong> ({role})</span>
          <button onClick={logout}>Abmelden</button>
        </div>
      </header>

      {/* 2. Haupt-Inhaltsbereich (hier werden die Seiten gerendert) */}
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
};