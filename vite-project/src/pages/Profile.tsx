import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Profile.module.css";
import { FiMail, FiLogOut, FiX } from "react-icons/fi";

type ProfileModalProps = {
  onClose: () => void;
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");

  if (!user) return null;

  const handleTrocarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put("/clientes/atualizar-email", {
        novoEmail,
        senhaAtual,
      });

      console.log(response.data);

      alert("Email atualizado com sucesso!");
      setShowEmailForm(false);
      setNovoEmail("");
      setSenhaAtual("");

      setUser({ ...user, email: novoEmail });
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Perfil
        </motion.h2>

        <motion.div
          className={styles.infoGroup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Função:</strong> {user.role}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
        </motion.div>

        <div className={styles.actions}>
          <motion.button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className={`${styles.button} ${styles.email}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
          >
            <FiMail style={{ marginRight: 8 }} />
            Trocar Email
          </motion.button>

          <AnimatePresence>
            {showEmailForm && (
              <motion.form
                onSubmit={handleTrocarEmail}
                className={styles.form}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="email"
                  placeholder="Novo email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                />
                <motion.button
                  type="submit"
                  className={styles.confirm}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirmar
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleLogout}
            className={`${styles.button} ${styles.logout}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
          >
            <FiLogOut style={{ marginRight: 8 }} />
            Logout
          </motion.button>

          <motion.button
            onClick={onClose}
            className={`${styles.button} ${styles.close}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
          >
            <FiX style={{ marginRight: 8 }} />
            Fechar
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};
