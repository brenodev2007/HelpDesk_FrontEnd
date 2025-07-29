import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./styles/Profile.module.css";
import { motion } from "framer-motion";

export const Profile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  if (loading || !user || !showPopup) return null;

  const handleHomeClick = () => {
    if (user.role === "TECNICO") navigate("/tecnico");
    else if (user.role === "USER" || user.role === "ADMIN")
      navigate("/criar-chamado");
    else navigate("/");
  };

  return (
    <div className={styles.backdrop} onClick={() => setShowPopup(false)}>
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // Previne fechar ao clicar dentro
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={styles.title}>Perfil do Usuário</h2>
        <div className={styles.infoGroup}>
          <p>
            <strong>Nome:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Função:</strong> {user.role}
          </p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={logout}
            className={`${styles.button} ${styles.logout}`}
          >
            Logout
          </button>
          <button
            onClick={handleHomeClick}
            className={`${styles.button} ${styles.home}`}
          >
            Ir para Home
          </button>
          <button
            onClick={() => setShowPopup(false)}
            className={`${styles.button} ${styles.close}`}
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
