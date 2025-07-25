import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../services/api";
import styles from "./styles/EditProfileForm.module.css";

interface Props {
  onCancel: () => void;
}

export const UpdateEmailForm: React.FC<Props> = ({ onCancel }) => {
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        "/clientes/atualizar-email",
        { novoEmail, senhaAtual },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Email atualizado:", response.data);
      toast.success("Email atualizado com sucesso!");
      onCancel();
    } catch (error: unknown) {
      console.error("Erro ao atualizar email:", error);
      const msg = error || "Erro ao atualizar email";
      toast.error(msg instanceof Error ? msg.message : String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={styles.form}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className={styles.title}>Atualizar Email</h2>
      <input
        type="email"
        placeholder="Novo Email"
        value={novoEmail}
        onChange={(e) => setNovoEmail(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Senha Atual"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
        required
        className={styles.input}
      />
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.buttonCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button type="submit" className={styles.save} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </motion.form>
  );
};
