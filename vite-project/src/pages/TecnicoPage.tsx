import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import api from "../services/api";
import styles from "./styles/PaginaTecnico.module.css";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type ChamadoServico = {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  chamado: {
    descricao: string;
    user: {
      email: string;
      nome?: string;
    };
  };
  servico: {
    nome: string;
  };
};

type StatusType = "PENDING" | "IN_PROGRESS" | "DONE";

export const PaginaTecnico: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chamados, setChamados] = useState<ChamadoServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "TECNICO") {
      navigate("/");
    } else {
      fetchChamados();
    }
  }, [user]);

  const fetchChamados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/clientes/meus-chamados-tecnico");
      const lista = response.data.chamados || [];
      setChamados(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      setError("Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (
    chamadoServicoId: string,
    novoStatus: StatusType
  ) => {
    try {
      await api.patch("/clientes/editar-status", {
        chamadoServicoId,
        novoStatus,
      });

      setChamados((prev) =>
        prev.map((chamado) =>
          chamado.id === chamadoServicoId
            ? { ...chamado, status: novoStatus }
            : chamado
        )
      );

      toast.success("✅ Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("❌ Erro ao atualizar o status.");
    }
  };

  const renderStatusBadge = (status: StatusType) => {
    switch (status) {
      case "PENDING":
        return <span className={styles.badgePending}>⏳ Pendente</span>;
      case "IN_PROGRESS":
        return <span className={styles.badgeInProgress}>🔧 Em Progresso</span>;
      case "DONE":
        return <span className={styles.badgeDone}>✅ Concluído</span>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Área do Técnico</h1>
          <button className={styles.refreshButton} onClick={fetchChamados}>
            Atualizar
          </button>
        </div>

        {loading && <p>Carregando chamados...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && chamados.length === 0 && (
          <p>Nenhum chamado disponível no momento.</p>
        )}

        <ul className={styles.listaChamados}>
          {chamados.map((chamado, index) => (
            <motion.li
              key={chamado.id}
              className={styles.chamadoCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <h3>{chamado.servico.nome}</h3>
              <p>
                <strong>Descrição:</strong> {chamado.chamado.descricao}
              </p>
              <p>
                <strong>Cliente:</strong>{" "}
                {chamado.chamado.user.nome || chamado.chamado.user.email}
              </p>
              <p>
                <strong>Status atual:</strong>{" "}
                {renderStatusBadge(chamado.status)}
              </p>
              <div style={{ marginTop: "10px" }}>
                <label htmlFor={`status-${chamado.id}`}>Alterar status:</label>
                <select
                  id={`status-${chamado.id}`}
                  value={chamado.status}
                  onChange={(e) =>
                    atualizarStatus(
                      chamado.id,
                      e.target.value.toUpperCase() as StatusType
                    )
                  }
                  className={styles.selectStatus}
                >
                  <option value="PENDING">Pendente</option>
                  <option value="IN_PROGRESS">Em Progresso</option>
                  <option value="DONE">Concluído</option>
                </select>
              </div>
            </motion.li>
          ))}
        </ul>
      </main>
    </div>
  );
};
