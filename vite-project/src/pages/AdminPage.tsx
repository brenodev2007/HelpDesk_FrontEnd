import React, { useState, FormEvent, ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/AdminPage.module.css";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

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
      console.error(error);
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
      console.error(error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get("clientes/listar-clientes");
      setClientes(response.data);
      setShowClientesModal(true);
    } catch (error) {
      toast.error("Erro ao buscar clientes");
      console.error(error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await api.get("clientes/listar-servicos");
      setServicos(response.data);
      setShowServicosModal(true);
    } catch (error) {
      toast.error("Erro ao buscar serviços");
      console.error(error);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const response = await api.get("clientes/listar-tecnicos");
      setTecnicos(response.data);
      setShowTecnicosModal(true);
    } catch (error) {
      toast.error("Erro ao buscar técnicos");
      console.error(error);
    }
  };

  const removerConta = async (id: string) => {
    if (!confirm("Deseja realmente remover esta conta?")) return;
    try {
      await api.delete("clientes/remover", { data: { id } });
      setClientes((prev) => prev.filter((c) => c.id !== id));
      toast.success("Conta removida com sucesso");
    } catch (error) {
      toast.error("Erro ao remover conta");
      console.error(error);
    }
  };

  const removerServico = async (id: string) => {
    if (!confirm("Deseja realmente remover este serviço?")) return;
    try {
      await api.delete(`clientes/remover-servico/${id}`);
      setServicos((prev) => prev.filter((s) => s.id !== id));
      toast.success("Serviço removido com sucesso");
    } catch (error) {
      toast.error("Erro ao remover serviço");
      console.error(error);
    }
  };

  const removerTecnico = async (id: string) => {
    if (!confirm("Deseja realmente remover este técnico?")) return;
    try {
      await api.delete("clientes/remover", { data: { id } });
      setTecnicos((prev) => prev.filter((t) => t.id !== id));
      toast.success("Técnico removido com sucesso");
    } catch (error) {
      toast.error("Erro ao remover técnico");
      console.error(error);
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

        {/* Clientes - lista melhorada */}
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
                    onClick={() => removerConta(cliente.id)}
                    title="Remover Conta"
                  >
                    <FaTrash style={{ marginRight: 6 }} />
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {/* Serviços */}
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
                      {servico.tecnico.id
                        ? `${servico.tecnico.email} (${servico.tecnico.id})`
                        : "Removido"}
                    </p>
                  </div>
                  <div className={styles.buttonsGroup}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => removerServico(servico.id)}
                      title="Remover Serviço"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {/* Técnicos */}
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
                    onClick={() => removerTecnico(tecnico.id)}
                    title="Remover Técnico"
                  >
                    <FaTrash style={{ marginRight: "6px" }} />
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default PainelAdministrador;
