import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // import corrigido
import api from "../services/api";
import { AuthContext, Role } from "../context/AuthContext";
import { User } from "../types/User";

export type AuthContextType = {
  user: User | null; // usa o tipo completo User
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; role: Role }>(token);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        api
          .get<User>(`/users/${decoded.id}`)
          .then((response) => {
            setUser(response.data); // response.data é do tipo User
          })
          .catch(() => {
            logout();
          });
      } catch {
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<{ id: string; role: Role }>(token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    // Buscar dados completos do usuário na API ao logar
    api
      .get<User>(`/users/${decoded.id}`)
      .then((response) => {
        setUser(response.data);
        navigate("/profile");
      })
      .catch(() => {
        logout();
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
