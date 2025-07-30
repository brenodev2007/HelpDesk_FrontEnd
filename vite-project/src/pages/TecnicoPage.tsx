import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import api from "../services/api";
import styles from "./styles/PaginaTecnico.module.css";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Select, { StylesConfig, GroupBase } from "react-select";
import clsx from "clsx";

import { RefreshCcw, User, BadgeCheck, Loader2, Clock } from "lucide-react";

type Servico = {
  titulo: string;
};
type ChamadoServicoAPIResponse = {
  status: StatusType;
  servico: {
    titulo: string;
  };
  chamado: {
    id: string;
    descricao: string;
    user: {
      nome?: string;
      email: string;
    };
  };
};

type StatusType = "PENDING" | "IN_PROGRESS" | "DONE";

type Chamado = {
  id: string;
  descricao: string;
  status: StatusType;
  user: {
    nome?: string;
    email: string;
  };
  servicos: Servico[];
};

type StatusOption = {
  value: StatusType;
  label: string;
  color: string;
  icon: React.ReactNode;
};

const statusOptions: StatusOption[] = [
  {
    value: "PENDING",
    label: "Pendente",
    color: "#facc15",
    icon: <Clock size={16} />,
  },
  {
    value: "IN_PROGRESS",
    label: "Em Progresso",
    color: "#3b82f6",
    icon: <Loader2 size={16} />,
  },
  {
    value: "DONE",
    label: "Concluído",
    color: "#10b981",
    icon: <BadgeCheck size={16} />,
  },
];

const customStyles: StylesConfig<
  StatusOption,
  false,
  GroupBase<StatusOption>
> = {
  control: (provided) => ({
    ...provided,
    borderRadius: "12px",
    borderColor: "#c3c9f5",
    boxShadow: "none",
    minHeight: "40px",
    fontSize: "1rem",
    backgroundColor: "#f7f9ff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#e0e7ff" : "#fff",
    color: "#1e2024",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e2024",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "12px",
  }),
};

export const PaginaTecnico: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalChamado, setModalChamado] = useState<Chamado | null>(null);

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
      const response = await api.get("clientes/meus-chamados-tecnico");
      const lista = response.data.chamados || [];

      const chamadosMap = new Map<string, Chamado>();

      (lista as ChamadoServicoAPIResponse[]).forEach((item) => {
        const chamadoId = item.chamado.id;

        if (!chamadosMap.has(chamadoId)) {
          chamadosMap.set(chamadoId, {
            id: chamadoId,
            descricao: item.chamado.descricao,
            status: item.status,
            user: item.chamado.user,
            servicos: [],
          });
        }

        const chamadoExistente = chamadosMap.get(chamadoId);
        if (chamadoExistente && item.servico) {
          chamadoExistente.servicos.push({ titulo: item.servico.titulo });
        }
      });
      setChamados(Array.from(chamadosMap.values()));
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      setError("Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (chamadoId: string, novoStatus: StatusType) => {
    try {
      await api.patch("clientes/editar-status", {
        chamadoId,
        novoStatus,
      });

      setChamados((prev) =>
        prev.map((chamado) =>
          chamado.id === chamadoId
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

  const getStatusColor = (status: StatusType) => {
    const found = statusOptions.find((o) => o.value === status);
    return found?.color ?? "#999";
  };

  return (
    <div className={styles.container}>
      {modalChamado && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalChamado(null)}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Detalhes do Chamado</h2>
            <p>
              <strong>Descrição:</strong> {modalChamado.descricao}
            </p>
            <p>
              <strong>Cliente:</strong>{" "}
              {modalChamado.user.nome || modalChamado.user.email}
            </p>

            <div style={{ marginTop: "1rem" }}>
              <strong>Serviços atribuídos:</strong>
              {modalChamado.servicos.length > 0 ? (
                <ul>
                  {modalChamado.servicos.map((servico, index) => (
                    <li key={index}>🔧 {servico.titulo}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum serviço atribuído a este chamado.</p>
              )}
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setModalChamado(null)}
            >
              Fechar
            </button>
          </motion.div>
        </div>
      )}

      <Sidebar />

      <main className={styles.mainWrapper}>
        <h1 className={styles.title}>Área do Técnico</h1>

        <button className={styles.refreshButton} onClick={fetchChamados}>
          <RefreshCcw size={16} style={{ marginRight: "0.5rem" }} />
          Atualizar
        </button>

        {loading && <p>Carregando chamados...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {!loading && chamados.length === 0 && (
          <p>Nenhum chamado disponível no momento.</p>
        )}

        <div className={styles.cardsGrid}>
          {chamados.map((chamado) => (
            <motion.div
              key={chamado.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className={styles.cardDesc}>{chamado.descricao}</p>

              <p className={styles.cardClient}>
                <User size={16} style={{ marginRight: 4 }} />
                <strong>Cliente: </strong>{" "}
                {chamado.user.nome || chamado.user.email}
              </p>

              <div
                className={clsx(styles.statusBadge)}
                style={{ backgroundColor: getStatusColor(chamado.status) }}
              >
                {statusOptions.find((o) => o.value === chamado.status)?.icon}{" "}
                {statusOptions.find((o) => o.value === chamado.status)?.label}
              </div>

              <div className={styles.selectWrapper}>
                <label
                  htmlFor={`status-select-${chamado.id}`}
                  className={styles.label}
                >
                  Alterar status:
                </label>

                <Select
                  inputId={`status-select-${chamado.id}`}
                  options={statusOptions}
                  value={statusOptions.find((o) => o.value === chamado.status)}
                  onChange={(selected) => {
                    if (selected) {
                      atualizarStatus(chamado.id, selected.value);
                    }
                  }}
                  styles={customStyles}
                  isSearchable={false}
                  formatOptionLabel={(data) => (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {data.icon}
                      {data.label}
                    </div>
                  )}
                />

                <button
                  className={styles.viewMoreButton}
                  onClick={() => setModalChamado(chamado)}
                >
                  Ver mais
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
