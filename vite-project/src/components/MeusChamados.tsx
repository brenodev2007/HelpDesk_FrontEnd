import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./styles/MeusChamados.module.css";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";

interface Chamado {
  id: string;
  prioridade: string;
  descricao: string;
  chamado_servico: {
    servico: {
      id: string;
      titulo: string;
    };
  }[];
  user?: {
    email: string;
  };
  tecnico?: {
    id: string;
    email: string;
  };
}

interface Servico {
  id: string;
  titulo: string;
}

interface Tecnico {
  id: string;
  email: string;
}

type ModalProps = {
  chamado: Chamado;
  onClose: () => void;
  onSuccess: () => void;
};

const Modal: React.FC<ModalProps> = ({ chamado, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [selectedServicosIds, setSelectedServicosIds] = useState<string[]>([]);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingServicos, setLoadingServicos] = useState(true);

  // Inicializa os selecionados com os dados do chamado
  useEffect(() => {
    if (chamado) {
      const servicosIds = chamado.chamado_servico.map((cs) => cs.servico.id);
      setSelectedServicosIds(servicosIds);
      setSelectedTecnicoId(chamado.tecnico?.id ?? "");
    }
  }, [chamado]);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const res = await api.get("/clientes/listar-servicos");
        setServicos(res.data);
      } catch {
        alert("Erro ao carregar serviços");
      } finally {
        setLoadingServicos(false);
      }
    };

    const fetchTecnicos = async () => {
      if (user?.role === "ADMIN") {
        try {
          const res = await api.get("/clientes/listar-tecnicos");
          if (Array.isArray(res.data)) setTecnicos(res.data);
        } catch {
          alert("Erro ao carregar técnicos");
        }
      }
    };

    fetchServicos();
    fetchTecnicos();
  }, [user?.role]);

  const handleCheckboxChange = (id: string) => {
    setSelectedServicosIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServicosIds.length === 0) {
      setErrorMsg("Selecione ao menos um serviço");
      return;
    }

    if (user?.role === "ADMIN" && !selectedTecnicoId) {
      setErrorMsg("Selecione um técnico");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      if (user?.role === "ADMIN") {
        await api.patch("/clientes/atribuir-chamado-tecnico", {
          chamadoId: chamado.id,
          tecnicoId: selectedTecnicoId,
        });
      } else {
        await api.patch("/clientes/pegar-chamado", {
          chamadoId: chamado.id,
        });
      }

      await api.post("/clientes/adicionar-servicos", {
        chamadoId: chamado.id,
        servicosIds: selectedServicosIds,
      });

      alert("Chamado processado com sucesso!");
      onSuccess();
      onClose();
    } catch {
      alert("Erro ao processar chamado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose} />
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        <h2>
          {user?.role === "ADMIN" ? "Atribuir Técnico" : "Pegar Chamado"} e
          Adicionar Serviços
        </h2>
        <p>
          <strong>Descrição:</strong> {chamado.descricao}
        </p>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            {user?.role === "ADMIN" && (
              <label>
                Selecione o Técnico:
                <select
                  value={selectedTecnicoId}
                  onChange={(e) => setSelectedTecnicoId(e.target.value)}
                  className={styles.select}
                >
                  <option value="">-- Escolha um técnico --</option>
                  {tecnicos.map((tec) => (
                    <option key={tec.id} value={tec.id}>
                      {tec.email}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <legend>Selecione os serviços:</legend>
            {loadingServicos ? (
              <p>Carregando serviços...</p>
            ) : (
              servicos.map((servico) => (
                <label key={servico.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={servico.id}
                    checked={selectedServicosIds.includes(servico.id)}
                    onChange={() => handleCheckboxChange(servico.id)}
                  />
                  {servico.titulo}
                </label>
              ))
            )}
          </fieldset>

          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.actionButton}
          >
            {loading ? "Processando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </>
  );
};

export const MeusChamados: React.FC = () => {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [modalChamado, setModalChamado] = useState<Chamado | null>(null);
  const { user } = useAuth();

  const fetchChamados = async () => {
    try {
      const rota =
        user?.role === "ADMIN"
          ? "/clientes/listar-todos-chamados"
          : "/clientes/chamados";

      const response = await api.get(rota);
      setChamados(response.data);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  const handleRemoverChamado = async (id: string) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover este chamado?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/clientes/remover-chamado/${id}`);
      alert("Chamado removido com sucesso!");
      fetchChamados();
    } catch (error) {
      console.error("Erro ao remover chamado:", error);
      alert("Erro ao remover chamado.");
    }
  };

  useEffect(() => {
    if (user) fetchChamados();
  }, [user]);

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.content}>
        <h1>
          {user?.role === "ADMIN" ? "Todos os Chamados" : "Meus Chamados"}
        </h1>

        {chamados.length === 0 ? (
          <p>
            {user?.role === "ADMIN"
              ? "Nenhum chamado encontrado no sistema."
              : "Você ainda não criou nenhum chamado."}
          </p>
        ) : (
          <table className={styles.chamadoTable}>
            <thead>
              <tr>
                <th>Responsável</th>
                <th>Serviços Atribuídos</th>
                <th>Prioridade</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((chamado) => (
                <tr key={chamado.id}>
                  <td>
                    {chamado.tecnico?.email
                      ? `Técnico: ${chamado.tecnico.email}`
                      : chamado.user?.email ?? "—"}
                  </td>
                  <td>
                    {chamado.chamado_servico.length > 0 ? (
                      chamado.chamado_servico.map((cs) => (
                        <div key={cs.servico.id}>{cs.servico.titulo}</div>
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>{chamado.prioridade}</td>
                  <td>{chamado.descricao}</td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => setModalChamado(chamado)}
                    >
                      {user?.role === "ADMIN"
                        ? "Atribuir Técnico / Serviços"
                        : "Pegar Chamado / Serviços"}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemoverChamado(chamado.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modalChamado && (
          <Modal
            chamado={modalChamado}
            onClose={() => setModalChamado(null)}
            onSuccess={fetchChamados}
          />
        )}
      </main>
    </div>
  );
};
