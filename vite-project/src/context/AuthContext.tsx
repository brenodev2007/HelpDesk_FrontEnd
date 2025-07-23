import { createContext, useContext } from "react";
import { User } from "../types/User";

export type Role = "ADMIN" | "USER" | "TECNICO";

export type AuthContextType = {
  user: User | null; // User completo
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);
