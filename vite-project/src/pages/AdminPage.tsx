import React, { useState, FormEvent, ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/AdminPage.module.css";
import api from "../services/api";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
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

  const [emailTecnico, setEmailTecnico] = useState("");
  const [passwordTecnico, setPasswordTecnico] = useState("");
  const [cargoTecnico, setCargoTecnico] = useState("");

  const [tituloServico, setTituloServico] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");
  const [tecnicoIdServico, setTecnicoIdServico] = useState("");

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

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Gerenciar Dados</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>Listar Clientes</li>
            <li className={styles.listItem}>Listar Serviços (Admin)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default PainelAdministrador;
