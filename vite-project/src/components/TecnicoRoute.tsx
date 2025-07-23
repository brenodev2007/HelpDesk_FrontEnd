import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const TecnicoRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== "TECNICO") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
