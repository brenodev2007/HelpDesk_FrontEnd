import { createContext } from "react";
import { User } from "../types/User";

export type Role = "ADMIN" | "USER" | "TECNICO";

export type AuthContextType = {
  user: User | null; // User completo
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
