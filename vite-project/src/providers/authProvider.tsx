import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { AuthContext, Role } from "../context/AuthContext";
import { User } from "../types/User";

export type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token no localStorage:", token);

    if (token) {
      try {
        const decoded = jwtDecode<{ sub: string }>(token);
        console.log("Token decodificado no useEffect:", decoded);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        api
          .get<User>(`/clientes/${decoded.sub}`)
          .then((response) => {
            console.log("Usuário obtido no useEffect:", response.data);
            setUser(response.data);
          })
          .catch((err) => {
            console.error(
              "Erro ao buscar usuário no useEffect:",
              err.response?.data || err.message
            );
            logout();
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.error("Erro ao decodificar token no useEffect:", error);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<{ sub: string; role: Role }>(token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    api
      .get<User>(`/clientes/${decoded.sub}`)
      .then((response) => {
        setUser(response.data);
        navigate("/profile");
      })
      .catch((err) => {
        console.error(
          "Erro ao buscar usuário no login:",
          err.response?.data || err.message
        );
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
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
