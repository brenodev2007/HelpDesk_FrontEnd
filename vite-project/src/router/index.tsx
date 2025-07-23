import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Profile } from "../pages/Profile";
import { CriarChamado } from "../pages/CriarChamado";
import { GerarServico } from "../pages/GerarServico";
import { useAuth } from "../context/AuthContext";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    // Pode colocar um loader aqui enquanto carrega o usuário
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={user ? <Navigate to="/profile" /> : <Login />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/profile" /> : <Register />}
      />

      {/* Rotas privadas */}
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/" replace />}
      />

      <Route
        path="/criar-chamado"
        element={
          user ? (
            user.role === "TECNICO" ? (
              <Navigate to="/tecnico" replace />
            ) : (
              <CriarChamado />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/tecnico"
        element={
          user ? (
            user.role === "TECNICO" ? (
              <GerarServico />
            ) : (
              <Navigate to="/criar-chamado" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
