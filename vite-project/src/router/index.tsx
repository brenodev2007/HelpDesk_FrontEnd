import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Profile } from "../pages/Profile";
import { CriarChamado } from "../pages/CriarChamado";
import { PaginaTecnico } from "../pages/TecnicoPage";
import { useAuth } from "../context/AuthContext";
import { AdminRoute } from "../components/AdminRoute";
import PainelAdministrador from "../pages/AdminPage";
import { MeusChamados } from "../components/MeusChamados";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
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

      {/* Rotas protegidas comuns para qualquer usuário logado */}
      <Route
        path="/meus-chamados"
        element={user ? <MeusChamados /> : <Navigate to="/" replace />}
      />

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

      {/* Rota para área do técnico - só para role TECNICO */}
      <Route
        path="/tecnico"
        element={
          user ? (
            user.role === "TECNICO" ? (
              <PaginaTecnico />
            ) : (
              <Navigate to="/criar-chamado" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Rota protegida apenas para ADMIN */}
      <Route element={<AdminRoute />}>
        <Route path="/painel-administrador" element={<PainelAdministrador />} />
      </Route>

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
