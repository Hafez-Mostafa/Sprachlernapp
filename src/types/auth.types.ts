import type { LoginRequest, Guardian, Admin } from "./index";

// Mögliche Rollen in der Anwendung

export type UserRole = "guardian" | "admin";

// Kombinierter User-Typ inkl. gestgelegter Rolle
export type User =
  | (Guardian & { role: "guardian" })
  | (Admin & { role: "admin" });

// Der reine Zustand (State) der Session
export interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // error: string | null;
}

// Die Funktionen & Werte, die der AuthContext bereitstellt.
export interface AuthContextType extends AuthState {
  loginGuardian: (credentials: LoginRequest) => Promise<void>;
  loginAdmin: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  // setError: (error: string | null) => void;
}
