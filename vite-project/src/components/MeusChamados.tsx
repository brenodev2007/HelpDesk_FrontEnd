// MeusChamados.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./styles/MeusChamados.module.css";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { toast } from "react-toastify";
import { ConfirmModal } from "../components/ConfirmModal";

interface Chamado {
  id: string;
  prioridade: string;
  descricao: string;
  categoria: string;
  chamado_servico: {
    servico: {
      id: string;
      titulo: string;
    };
  }[];
  user?: { email: string };
  tecnico?: { id: string; email: string };
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
  const [selectedServicoId, setSelectedServicoId] = useState<string>("");
  const [selectedTecnicoId, setSelectedTecnicoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSelectedServicoId(
      chamado.chamado_servico.length > 0
        ? chamado.chamado_servico[0].servico.id
        : ""
    );
    setSelectedTecnicoId(chamado.tecnico?.id ?? "");
  }, [chamado]);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const res = await api.get("/clientes/listar-servicos");
        const todosServicos: Servico[] = res.data;

        // Remover serviços já atribuídos a qualquer chamado
        const servicosUsados = new Set<string>();
        const resChamados = await api.get("/clientes/listar-todos-chamados");

        resChamados.data.forEach((chamado: Chamado) => {
          chamado.chamado_servico.forEach((cs) => {
            servicosUsados.add(cs.servico.id);
          });
        });

        const disponiveis = todosServicos.filter(
          (servico) => !servicosUsados.has(servico.id)
        );
        setServicos(disponiveis);
      } catch {
        toast.error("Erro ao carregar serviços");
      } finally {
        setLoadingServicos(false);
      }
    };

    const fetchTecnicos = async () => {
      if (user?.role === "ADMIN") {
        try {
          const res = await api.get("/clientes/listar-tecnicos");
          setTecnicos(Array.isArray(res.data) ? res.data : []);
        } catch {
          toast.error("Erro ao carregar técnicos");
        }
      }
    };

    fetchServicos();
    fetchTecnicos();
  }, [user?.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (user?.role === "ADMIN" && !selectedTecnicoId) {
      setErrorMsg("Selecione um técnico");
      return;
    }

    if (!selectedServicoId) {
      setErrorMsg("Selecione um serviço");
      return;
    }

    setLoading(true);
    try {
      if (user?.role === "ADMIN") {
        await api.patch("/clientes/atribuir-chamado-tecnico", {
          chamadoId: chamado.id,
          tecnicoId: selectedTecnicoId,
        });
      }

      await api.patch("/clientes/adicionar-servico", {
        chamadoId: chamado.id,
        servicosIds: [selectedServicoId],
      });

      toast.success("Chamado processado com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar chamado");
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
          Adicionar Serviço
        </h2>
        <p>
          <strong>Descrição:</strong> {chamado.descricao}
        </p>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading || chamado.chamado_servico.length > 0}>
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

            <label>
              Serviço:
              {loadingServicos ? (
                <p>Carregando serviços...</p>
              ) : servicos.length === 0 ? (
                <p>Nenhum serviço disponível</p>
              ) : (
                <select
                  value={selectedServicoId}
                  onChange={(e) => setSelectedServicoId(e.target.value)}
                  className={styles.select}
                >
                  <option value="">-- Escolha um serviço --</option>
                  {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.titulo}
                    </option>
                  ))}
                </select>
              )}
            </label>
          </fieldset>

          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading || chamado.chamado_servico.length > 0}
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
  const [chamadoParaExcluir, setChamadoParaExcluir] = useState<Chamado | null>(
    null
  );
  const { user } = useAuth();

  const atualizarChamados = async () => {
    try {
      const rota =
        user?.role === "ADMIN"
          ? "/clientes/listar-todos-chamados"
          : "/clientes/chamados";
      const res = await api.get(rota);
      setChamados(res.data);
    } catch (error) {
      toast.error("Erro ao buscar chamados");
      console.error("Erro ao buscar chamados:", error);
    }
  };

  const confirmarRemocaoChamado = async () => {
    if (!chamadoParaExcluir) return;
    try {
      await api.delete(`/clientes/remover-chamado/${chamadoParaExcluir.id}`);
      toast.success("Chamado removido com sucesso!");
      atualizarChamados();
    } catch (error) {
      toast.error("Erro ao remover chamado.");
      console.error("Erro ao remover chamado:", error);
    } finally {
      setChamadoParaExcluir(null);
    }
  };

  useEffect(() => {
    if (user) atualizarChamados();
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
                <th>Categoria</th>
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
                  <td>{chamado.categoria}</td>
                  <td>{chamado.prioridade}</td>
                  <td>{chamado.descricao}</td>
                  <td>
                    <button
                      className={styles.actionButton}
                      disabled={chamado.chamado_servico.length > 0}
                      onClick={() => setModalChamado(chamado)}
                    >
                      {user?.role === "ADMIN"
                        ? "Atribuir Técnico / Serviço"
                        : "Pegar Chamado / Serviço"}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => setChamadoParaExcluir(chamado)}
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
            onSuccess={atualizarChamados}
          />
        )}

        {chamadoParaExcluir && (
          <ConfirmModal
            title="Confirmar Exclusão"
            message="Tem certeza que deseja excluir este chamado? Essa ação não poderá ser desfeita."
            onConfirm={confirmarRemocaoChamado}
            onCancel={() => setChamadoParaExcluir(null)}
          />
        )}
      </main>
    </div>
  );
};
