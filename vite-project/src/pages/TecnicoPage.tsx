import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/PaginaTecnico.module.css";

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

  // Se não for técnico, redireciona
  useEffect(() => {
    if (!user || user.role !== "TECNICO") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchChamados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/tecnico/chamados");
      setChamados(response.data.chamados ?? []);
    } catch (error) {
      alert(error || "Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (
    chamadoServicoId: string,
    novoStatus: StatusType
  ) => {
    try {
      await axios.patch("/api/tecnico/editar-status", {
        chamadoServicoId,
        novoStatus,
      });

      // Atualiza localmente
      setChamados((prevChamados) =>
        prevChamados.map((c) =>
          c.id === chamadoServicoId ? { ...c, status: novoStatus } : c
        )
      );
    } catch (error) {
      alert(error || "Erro ao atualizar status.");
    }
  };

  useEffect(() => {
    fetchChamados();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Área do Técnico</h1>
          <button onClick={fetchChamados} className={styles.refreshButton}>
            Atualizar Lista
          </button>
        </div>

        {loading && <p>Carregando chamados...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && chamados.length === 0 && <p>Nenhum chamado encontrado.</p>}

        {!loading && chamados.length > 0 && (
          <ul className={styles.listaChamados}>
            {chamados.map((chamado) => (
              <li key={chamado.id} className={styles.chamadoCard}>
                <h3>{chamado.servico.nome}</h3>
                <p>
                  <strong>Descrição:</strong> {chamado.chamado.descricao}
                </p>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {chamado.chamado.user.nome || chamado.chamado.user.email}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <select
                    value={chamado.status}
                    onChange={(e) =>
                      atualizarStatus(chamado.id, e.target.value as StatusType)
                    }
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="IN_PROGRESS">Em Progresso</option>
                    <option value="DONE">Concluído</option>
                  </select>
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
