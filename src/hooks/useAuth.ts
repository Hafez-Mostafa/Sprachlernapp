import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../types/auth.types";

/**
 * Custom Hook für den schnellen und typsicheren Zugriff auf den AuthContext.
 *
 * Anwendung in Komponenten:
 * const { user, isAuthenticated, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Sicherheitsnetz: Verhindert die Nutzung außerhalb des AuthProviders
  if (!context) {
    throw new Error(
      "useAuth muss innerhalb eines AuthProviders verwendet werden.",
    );
  }

  return context;
};


/**
 * // Beispiel: In einem Navigationselement oder Profil-Header
import { useAuth } from "../hooks/useAuth";

export const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <p>Nicht eingeloggt</p>;

  return (
    <div>
      <p>Willkommen, {user?.email}</p>
      <button onClick={logout}>Abmelden</button>
    </div>
  );
};
 */
