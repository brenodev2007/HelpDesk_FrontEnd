import React from "react";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/AdminPage.module.css";

const PainelAdministrador: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Painel do Administrador</h1>
        <p className={styles.subtitle}>
          Bem-vindo ao painel exclusivo para administradores.
        </p>

        <section className={styles.actionsSection}>
          <button className={styles.actionButton}>Criar Técnico</button>
          <button className={styles.actionButton}>Criar Serviço</button>
        </section>

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
