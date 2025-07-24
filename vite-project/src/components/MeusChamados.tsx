import React, { useEffect, useState, FormEvent } from "react";
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
      nome: string;
      id: string;
    };
  }[];
}

interface Servico {
  id: string;
  titulo: string;
}

type ModalProps = {
  chamado: Chamado;
  onClose: () => void;
  onSuccess: () => void;
};

const Modal: React.FC<ModalProps> = ({ chamado, onClose, onSuccess }) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServicosIds, setSelectedServicosIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingServicos, setLoadingServicos] = useState(true);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const res = await api.get("/clientes/listar-servicos");
        setServicos(res.data);
      } catch (error) {
        alert(error || "Erro ao carregar serviços");
      } finally {
        setLoadingServicos(false);
      }
    };
    fetchServicos();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedServicosIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedServicosIds.length === 0) {
      setErrorMsg("Selecione ao menos um serviço");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Atribuir chamado ao técnico
      await api.patch("/clientes/pegar-chamado", { chamadoId: chamado.id });

      // 2. Adicionar serviços selecionados
      await api.post("/clientes/adicionar-servicos", {
        chamadoId: chamado.id,
        servicosIds: selectedServicosIds,
      });

      alert("Chamado atribuído e serviços adicionados com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      const message = error || "Erro ao processar ação";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose} />
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.modalCloseButton}
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>

        <h2>Atribuir Chamado e Adicionar Serviços</h2>
        <p>
          <strong>Descrição:</strong> {chamado.descricao}
        </p>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <legend>Selecione os serviços para adicionar:</legend>
            {loadingServicos && <p>Carregando serviços...</p>}
            {!loadingServicos && servicos.length === 0 && (
              <p>Nenhum serviço disponível.</p>
            )}
            {servicos.map((servico) => (
              <label key={servico.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={servico.id}
                  checked={selectedServicosIds.includes(servico.id)}
                  onChange={() => handleCheckboxChange(servico.id)}
                />
                {servico.titulo}
              </label>
            ))}
          </fieldset>

          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.actionButton}
          >
            {loading ? "Salvando..." : "Confirmar"}
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
  console.log(user);

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await api.get("/clientes/chamados");
        setChamados(response.data);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      }
    };

    fetchChamados();
  }, []);

  const refreshChamados = () => {
    api
      .get("/clientes/chamados")
      .then((res) => setChamados(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.content}>
        <h1>Meus Chamados</h1>

        {chamados.length === 0 ? (
          <p>Você ainda não criou nenhum chamado.</p>
        ) : (
          <ul className={styles.chamadoList}>
            {chamados.map((chamado) => (
              <li key={chamado.id} className={styles.card}>
                <h2>
                  {chamado.chamado_servico?.[0]?.servico?.nome ??
                    "Serviço não disponível"}
                </h2>
                <p>
                  <strong>Prioridade:</strong> {chamado.prioridade}
                </p>
                <p>
                  <strong>Descrição:</strong> {chamado.descricao}
                </p>
                <button
                  className={styles.actionButton}
                  onClick={() => setModalChamado(chamado)}
                >
                  Pegar Chamado / Adicionar Serviços
                </button>
              </li>
            ))}
          </ul>
        )}

        {modalChamado && (
          <Modal
            chamado={modalChamado}
            onClose={() => setModalChamado(null)}
            onSuccess={refreshChamados}
          />
        )}
      </main>
    </div>
  );
};
