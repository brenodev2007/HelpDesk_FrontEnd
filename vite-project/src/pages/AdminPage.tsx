import React, { useState, FormEvent, ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/AdminPage.module.css";
import api from "../services/api";

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

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose} />
      <div className={styles.modalContent}>
        <button
          className={styles.modalCloseButton}
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        {children}
      </div>
    </>
  );
};

const PainelAdministrador: React.FC = () => {
  const [showFormTecnico, setShowFormTecnico] = useState(false);
  const [showFormServico, setShowFormServico] = useState(false);
  const [showClientesModal, setShowClientesModal] = useState(false);
  const [showServicosModal, setShowServicosModal] = useState(false);

  const [emailTecnico, setEmailTecnico] = useState("");
  const [passwordTecnico, setPasswordTecnico] = useState("");
  const [cargoTecnico, setCargoTecnico] = useState("");

  const [tituloServico, setTituloServico] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");
  const [tecnicoIdServico, setTecnicoIdServico] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const handleCriarTecnico = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("clientes/criar-tecnico", {
        email: emailTecnico,
        password: passwordTecnico,
        cargo: cargoTecnico || undefined,
      });
      alert("Técnico criado com sucesso! ID: " + res.data.tecnicoId);
      setShowFormTecnico(false);
      setEmailTecnico("");
      setPasswordTecnico("");
      setCargoTecnico("");
    } catch (error) {
      alert(error || "Erro ao criar técnico");
    }
  };

  const handleCriarServico = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("clientes/criar-servico", {
        titulo: tituloServico,
        descricao: descricaoServico,
        tecnicoId: tecnicoIdServico,
      });
      alert("Serviço criado com sucesso! ID: " + res.data.id);
      setShowFormServico(false);
      setTituloServico("");
      setDescricaoServico("");
      setTecnicoIdServico("");
    } catch (error) {
      alert(error || "Erro ao criar serviço");
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get("clientes/listar-clientes");
      setClientes(response.data);
      setShowClientesModal(true);
    } catch (error) {
      alert(error || "Erro ao buscar clientes");
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await api.get("clientes/listar-servicos");
      setServicos(response.data);
      setShowServicosModal(true);
    } catch (error) {
      alert(error || "Erro ao buscar serviços");
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
          </ul>
        </section>

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
              <button type="submit">Salvar Técnico</button>
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
              <label>
                ID do Técnico:
                <input
                  type="text"
                  value={tecnicoIdServico}
                  onChange={(e) => setTecnicoIdServico(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Salvar Serviço</button>
            </form>
          </Modal>
        )}

        {showClientesModal && (
          <Modal onClose={() => setShowClientesModal(false)}>
            <h3>Clientes Cadastrados</h3>
            <ul>
              {clientes.map((cliente) => (
                <li key={cliente.id}>
                  <strong>ID:</strong> {cliente.id}
                  <br />
                  <strong>Email:</strong> {cliente.email}
                  <br />
                  <strong>Cargo:</strong> {cliente.cargo || "N/A"}
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {showServicosModal && (
          <Modal onClose={() => setShowServicosModal(false)}>
            <h3>Serviços Cadastrados</h3>
            <ul>
              {servicos.map((servico) => (
                <li key={servico.id}>
                  <strong>ID:</strong> {servico.id}
                  <br />
                  <strong>Título:</strong> {servico.titulo}
                  <br />
                  <strong>Descrição:</strong> {servico.descricao}
                  <br />
                  <strong>Técnico:</strong> {servico.tecnico.email} (
                  {servico.tecnico.id})
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
