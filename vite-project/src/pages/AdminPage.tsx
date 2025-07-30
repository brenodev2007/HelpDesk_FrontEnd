import React, { useState, FormEvent, ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/AdminPage.module.css";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { ConfirmModal } from "../components/ConfirmModal";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

type Cliente = {
  id: string;
  email: string;
  cargo?: string | null;
};

type Servico = {
  id: string;
  titulo: string;
  descricao: string;
  tecnico: {
    id: string;
    email: string;
    cargo?: string | null;
  };
};

type ConfirmDelete = {
  id: string;
  type: "cliente" | "tecnico" | "servico";
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
  <>
    <div className={styles.modalBackdrop} onClick={onClose} />
    <motion.div
      className={styles.modalContent}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
    >
      <button
        className={styles.modalCloseButton}
        onClick={onClose}
        aria-label="Fechar modal"
      >
        &times;
      </button>
      {children}
    </motion.div>
  </>
);

const PainelAdministrador: React.FC = () => {
  const [showFormTecnico, setShowFormTecnico] = useState(false);
  const [showFormServico, setShowFormServico] = useState(false);
  const [showClientesModal, setShowClientesModal] = useState(false);
  const [showServicosModal, setShowServicosModal] = useState(false);
  const [showTecnicosModal, setShowTecnicosModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete | null>(
    null
  );

  const [emailTecnico, setEmailTecnico] = useState("");
  const [passwordTecnico, setPasswordTecnico] = useState("");
  const [cargoTecnico, setCargoTecnico] = useState("");

  const [tituloServico, setTituloServico] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [tecnicos, setTecnicos] = useState<Cliente[]>([]);

  const handleCriarTecnico = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("clientes/criar-tecnico", {
        email: emailTecnico,
        password: passwordTecnico,
        cargo: cargoTecnico || undefined,
      });
      toast.success("Técnico criado com sucesso!");
      setShowFormTecnico(false);
      setEmailTecnico("");
      setPasswordTecnico("");
      setCargoTecnico("");
    } catch (error) {
      toast.error("Erro ao criar técnico");
      console.error("Erro ao criar técnico:", error);
    }
  };

  const handleCriarServico = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("clientes/criar-servico", {
        titulo: tituloServico,
        descricao: descricaoServico,
      });
      toast.success("Serviço criado com sucesso!");
      setShowFormServico(false);
      setTituloServico("");
      setDescricaoServico("");
    } catch (error) {
      toast.error("Erro ao criar serviço");
      console.error("Erro ao criar serviço:", error);
    }
  };

  const removerEntidade = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    try {
      if (type === "cliente" || type === "tecnico") {
        await api.delete("clientes/remover", { data: { id } });
        if (type === "cliente")
          setClientes((prev) => prev.filter((c) => c.id !== id));
        if (type === "tecnico")
          setTecnicos((prev) => prev.filter((t) => t.id !== id));
      } else if (type === "servico") {
        await api.delete(`clientes/remover-servico/${id}`);
        setServicos((prev) => prev.filter((s) => s.id !== id));
      }
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} removido com sucesso`
      );
    } catch (error) {
      toast.error(`Erro ao remover ${type}`);
      console.error(`Erro ao remover ${type}:`, error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get("clientes/listar-clientes");
      setClientes(response.data);
      setShowClientesModal(true);
    } catch (error) {
      toast.error("Erro ao buscar clientes");
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await api.get("clientes/listar-servicos");
      setServicos(response.data);
      setShowServicosModal(true);
    } catch (error) {
      toast.error("Erro ao buscar serviços");
      console.error("Erro ao buscar serviços:", error);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const response = await api.get("clientes/listar-tecnicos");
      setTecnicos(response.data);
      setShowTecnicosModal(true);
    } catch (error) {
      toast.error("Erro ao buscar técnicos");
      console.error("Erro ao buscar técnicos:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Painel do Administrador</h1>
        <p className={styles.subtitle}>
          Bem-vindo ao painel exclusivo para administradores.
        </p>

        <section className={styles.actionsSection}>
          <button
            className={styles.actionButton}
            onClick={() => setShowFormTecnico(true)}
          >
            Criar Técnico
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setShowFormServico(true)}
          >
            Criar Serviço
          </button>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Gerenciar Dados</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <button onClick={fetchClientes}>Listar Clientes</button>
            </li>
            <li className={styles.listItem}>
              <button onClick={fetchServicos}>Listar Serviços</button>
            </li>
            <li className={styles.listItem}>
              <button onClick={fetchTecnicos}>Listar Técnicos</button>
            </li>
          </ul>
        </section>

        {/* Modais de formulários */}
        {showFormTecnico && (
          <Modal onClose={() => setShowFormTecnico(false)}>
            <form onSubmit={handleCriarTecnico} className={styles.form}>
              <h3>Criar Técnico</h3>
              <label>
                Email:
                <input
                  type="email"
                  value={emailTecnico}
                  onChange={(e) => setEmailTecnico(e.target.value)}
                  required
                  autoFocus
                />
              </label>
              <label>
                Senha:
                <input
                  type="password"
                  value={passwordTecnico}
                  onChange={(e) => setPasswordTecnico(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
              <label>
                Cargo (opcional):
                <input
                  type="text"
                  value={cargoTecnico}
                  onChange={(e) => setCargoTecnico(e.target.value)}
                />
              </label>
              <button type="submit" className={styles.btnEnviar}>
                Salvar Técnico
              </button>
            </form>
          </Modal>
        )}

        {showFormServico && (
          <Modal onClose={() => setShowFormServico(false)}>
            <form onSubmit={handleCriarServico} className={styles.form}>
              <h3>Criar Serviço</h3>
              <label>
                Título:
                <input
                  type="text"
                  value={tituloServico}
                  onChange={(e) => setTituloServico(e.target.value)}
                  minLength={2}
                  required
                  autoFocus
                />
              </label>
              <label>
                Descrição:
                <textarea
                  value={descricaoServico}
                  onChange={(e) => setDescricaoServico(e.target.value)}
                  minLength={5}
                  required
                />
              </label>
              <button type="submit" className={styles.btnEnviar}>
                Salvar Serviço
              </button>
            </form>
          </Modal>
        )}

        {showClientesModal && (
          <Modal onClose={() => setShowClientesModal(false)}>
            <h3>Clientes Cadastrados</h3>
            <ul className={styles.modalList}>
              {clientes.map((cliente) => (
                <li key={cliente.id} className={styles.clienteCard}>
                  <div className={styles.clienteInfo}>
                    <p>
                      <strong>ID:</strong> {cliente.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {cliente.email}
                    </p>
                    <p>
                      <strong>Cargo:</strong> {cliente.cargo || "N/A"}
                    </p>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      setConfirmDelete({ id: cliente.id, type: "cliente" })
                    }
                  >
                    <FaTrash style={{ marginRight: 6 }} /> Remover
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {showServicosModal && (
          <Modal onClose={() => setShowServicosModal(false)}>
            <h3>Serviços Cadastrados</h3>
            <ul className={styles.modalList}>
              {servicos.map((servico) => (
                <li key={servico.id} className={styles.modalItem}>
                  <div className={styles.servicoInfo}>
                    <p>
                      <strong>ID:</strong> {servico.id}
                    </p>
                    <p>
                      <strong>Título:</strong> {servico.titulo}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {servico.descricao}
                    </p>
                    <p>
                      <strong>Técnico:</strong>{" "}
                      {servico.tecnico?.email || "Removido"}
                    </p>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      setConfirmDelete({ id: servico.id, type: "servico" })
                    }
                  >
                    <FaTrash style={{ marginRight: 6 }} /> Remover
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {showTecnicosModal && (
          <Modal onClose={() => setShowTecnicosModal(false)}>
            <h3>Técnicos Cadastrados</h3>
            <ul className={styles.modalList}>
              {tecnicos.map((tecnico) => (
                <li key={tecnico.id} className={styles.tecnicoCard}>
                  <div className={styles.tecnicoInfo}>
                    <p>
                      <strong>ID:</strong> {tecnico.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {tecnico.email}
                    </p>
                    <p>
                      <strong>Cargo:</strong> {tecnico.cargo || "N/A"}
                    </p>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      setConfirmDelete({ id: tecnico.id, type: "tecnico" })
                    }
                  >
                    <FaTrash style={{ marginRight: 6 }} /> Remover
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {confirmDelete && (
          <ConfirmModal
            title="Confirmar Exclusão"
            message="Deseja realmente excluir este registro? Essa ação não poderá ser desfeita."
            onConfirm={removerEntidade}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </main>
    </div>
  );
};

export default PainelAdministrador;
