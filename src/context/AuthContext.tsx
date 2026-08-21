import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/auth.service";
import { guardianService } from "../services/guardian.service";
import { adminService } from "../services/admin.service";
import type {
  AuthState,
  AuthContextType,
  User,
  UserRole,
} from "../types/auth.types";
import type { LoginRequest } from "../types";

// =======================================================
// 1. Context & Speicher-Schlüssel (Storage Keys)
// =======================================================

// Datengefäß für den Auth-Kontext erstellen (Standardwert ist undefined)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Getrennte Token-Keys pro Rolle -> passend zu den zwei API-Clients
// (apiClient liest "guardian_token", adminApiClient liest "admin_token")
const GUARDIAN_TOKEN_KEY = "guardian_token";
const ADMIN_TOKEN_KEY = "admin_token";
const ROLE_KEY = "auth_role";

// Hilfsfunktion: liefert den passenden Token-Key je nach Rolle
const tokenKeyForRole = (role: UserRole): string =>
  role === "guardian" ? GUARDIAN_TOKEN_KEY : ADMIN_TOKEN_KEY;

// =======================================================
// 2. AuthProvider-Komponente
// =======================================================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialer State: Rolle zuerst auslesen, dann das dazu passende Token
  const initialRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const initialToken = initialRole
    ? localStorage.getItem(tokenKeyForRole(initialRole))
    : null;

  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    token: initialToken,
    isLoading: true,                         // Zeigt an, dass die Session-Prüfung läuft
    isAuthenticated: false,                  // Standardmäßig unauthentifiziert
  });

  // =======================================================
  // 3. Automatischer Session-Restore beim App-Start
  // =======================================================
  useEffect(() => {
    const initAuth = async () => {
      const storedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;

      // Ohne Rolle kann kein passender Token-Key bestimmt werden
      if (!storedRole) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const storedToken = localStorage.getItem(tokenKeyForRole(storedRole));

      if (!storedToken) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        let user: User;

        // Je nach Rolle das entsprechende Benutzerprofil vom Backend laden
        if (storedRole === "guardian") {
          const profile = await guardianService.getProfile();
          user = { ...profile, role: "guardian" };
        } else {
          const profile = await adminService.getProfile();
          user = { ...profile, role: "admin" };
        }

        // Bei Erfolg: Authentifizierten Zustand im React-State speichern
        setState({
          user,
          role: storedRole,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        // Bei Fehler (z. B. ungültiges/abgelaufenes Token): Speicher leeren
        logout();
      }
    };

    initAuth();
  }, []);

  // =======================================================
  // 4. Login-Funktion für Erziehungsberechtigte (Guardian)
  // =======================================================
  const loginGuardian = async (credentials: LoginRequest) => {
    // 1. Zugangsdaten an Backend senden und Token empfangen
    const response = await authService.loginGuardian(credentials);
    const token = response.access_token;

    if (!token) throw new Error("Kein Token in der Antwort enthalten.");

    // 2. Token unter eigenem Guardian-Key speichern + Rolle merken
    localStorage.setItem(GUARDIAN_TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, "guardian");

    // 3. Profildaten laden
    const profile = await guardianService.getProfile();

    // 4. State aktualisieren -> App weiß, dass der Guardian eingeloggt ist
    setState({
      user: { ...profile, role: "guardian" },
      role: "guardian",
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  // =======================================================
  // 5. Login-Funktion für Administratoren (Admin)
  // =======================================================
  const loginAdmin = async (credentials: LoginRequest) => {
    // 1. Zugangsdaten an Backend senden und Token empfangen
    const response = await authService.loginAdmin(credentials);
    const token = response.access_token;

    if (!token) throw new Error("Kein Token in der Antwort enthalten.");

    // 2. Token unter eigenem Admin-Key speichern + Rolle merken
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, "admin");

    // 3. Profildaten laden
    const profile = await adminService.getProfile();

    // 4. State aktualisieren -> App weiß, dass der Admin eingeloggt ist
    setState({
      user: { ...profile, role: "admin" },
      role: "admin",
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  // =======================================================
  // 6. Logout-Funktion
  // =======================================================
  const logout = () => {
    // 1. Beide Token-Keys + Rolle leeren (unabhängig davon, welche Rolle aktiv war)
    localStorage.removeItem(GUARDIAN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);

    // 2. React-State auf Ausgangszustand zurücksetzen
    setState({
      user: null,
      role: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  // =======================================================
  // 7. Provider stellt Werte allen untergeordneten Komponenten bereit
  // =======================================================
  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginGuardian,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
