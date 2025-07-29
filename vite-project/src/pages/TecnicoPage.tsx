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

type ChamadoServico = {
  id: string;
  status: StatusType;
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

type StatusOption = {
  value: StatusType;
  label: string;
  color: string;
};

const statusOptions: StatusOption[] = [
  { value: "PENDING", label: "Pendente", color: "#facc15" },
  { value: "IN_PROGRESS", label: "Em Progresso", color: "#3b82f6" },
  { value: "DONE", label: "Concluído", color: "#10b981" },
];

// Tipando customStyles com StylesConfig do react-select
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
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e2024",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "12px",
  }),
};

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
      const response = await api.get("clientes/meus-chamados-tecnico");
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
      await api.patch("clientes/editar-status", {
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

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "PENDING":
        return "#facc15";
      case "IN_PROGRESS":
        return "#3b82f6";
      case "DONE":
        return "#10b981";
      default:
        return "#999";
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainWrapper}>
        <h1 className={styles.title}>Área do Técnico</h1>

        <button className={styles.refreshButton} onClick={fetchChamados}>
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
              <h3 className={styles.cardTitle}>{chamado.servico.nome}</h3>

              <p className={styles.cardDesc}>{chamado.chamado.descricao}</p>

              <p className={styles.cardClient}>
                <strong>Cliente: </strong>
                {chamado.chamado.user.nome || chamado.chamado.user.email}
              </p>

              <div
                className={clsx(styles.statusBadge)}
                style={{ backgroundColor: getStatusColor(chamado.status) }}
              >
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
                      atualizarStatus(chamado.id, selected.value as StatusType);
                    }
                  }}
                  styles={customStyles}
                  isSearchable={false}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
