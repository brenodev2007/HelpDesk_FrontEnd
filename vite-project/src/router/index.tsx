import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { CriarChamado } from "../pages/CriarChamado";
import { PaginaTecnico } from "../pages/TecnicoPage";
import { useAuth } from "../context/AuthContext";
import { AdminRoute } from "../components/AdminRoute";
import PainelAdministrador from "../pages/AdminPage";
import { ProfileModalOverlay } from "../hooks/ProfileModalOverlay";
import { MeusChamados } from "../components/MeusChamados";
import { PrivateRoute } from "../components/PrivateRoute";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rota raiz - redireciona direto para criar chamado */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<CriarChamado />} />

        <Route path="/profile" element={<ProfileModalOverlay />} />

        {/* Rotas protegidas comuns para qualquer usuário logado */}
        <Route
          path="/meus-chamados"
          element={user ? <MeusChamados /> : <Navigate to="/login" replace />}
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
              <Navigate to="/login" replace />
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
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rota protegida apenas para ADMIN */}
        <Route element={<AdminRoute />}>
          <Route
            path="/painel-administrador"
            element={<PainelAdministrador />}
          />
        </Route>
      </Route>

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
