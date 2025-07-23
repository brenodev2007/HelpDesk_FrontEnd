import React from "react";
import { Sidebar } from "../components/Sidebar";

const PainelAdministrador: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ padding: "2rem", flex: 1 }}>
        <h1>Painel do Administrador</h1>
        <p>Bem-vindo ao painel exclusivo para administradores.</p>
      </main>
    </div>
  );
};

export default PainelAdministrador;
