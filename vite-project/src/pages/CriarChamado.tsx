import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/CriarChamado.module.css";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaTasks, FaClipboardList } from "react-icons/fa";

export const CriarChamado: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState<string>("");
  const [prioridade, setPrioridade] = useState<"BAIXA" | "MEDIA" | "ALTA">(
    "BAIXA"
  );
  const [categoria, setCategoria] = useState<
    "SUPORTE" | "MANUTENCAO" | "CONSULTORIA" | "TREINAMENTO"
  >("SUPORTE");
  const [erro, setErro] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    if (user.role === "TECNICO") {
      navigate("/tecnico");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (descricao.trim().length < 10) {
      setErro("A descrição deve ter pelo menos 10 caracteres.");
      return;
    }

    try {
      const response = await api.post("/clientes/criar-chamado", {
        descricao,
        prioridade,
        categoria,
      });

      console.log("Chamado criado:", response.data);

      setMensagem("Chamado criado com sucesso!");
      setDescricao("");
      setPrioridade("BAIXA");
      setCategoria("SUPORTE");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(error.response?.data?.error || "Erro ao criar chamado.");
      } else {
        setErro("Erro desconhecido ao criar chamado.");
      }
    }
  };

  const handleReset = () => {
    setDescricao("");
    setPrioridade("BAIXA");
    setCategoria("SUPORTE");
    setErro("");
    setMensagem("");
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainWrapper}>
        {/* Formulário */}
        <motion.form
          onSubmit={handleSubmit}
          className={styles.formBox}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Criar Chamado</h2>
          {erro && <p className={styles.errorText}>{erro}</p>}
          {mensagem && <p className={styles.successText}>{mensagem}</p>}

          <div className={styles.formGroup}>
            <label htmlFor="descricao" className={styles.label}>
              Descrição:
            </label>
            <textarea
              id="descricao"
              className={styles.textarea}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prioridade" className={styles.label}>
              Prioridade:
            </label>
            <select
              id="prioridade"
              className={styles.selectInput}
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value as "BAIXA" | "MEDIA" | "ALTA")
              }
            >
              <option value="BAIXA">BAIXA</option>
              <option value="MEDIA">MÉDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoria" className={styles.label}>
              Categoria do Serviço:
            </label>
            <select
              id="categoria"
              className={styles.selectInput}
              value={categoria}
              onChange={(e) =>
                setCategoria(
                  e.target.value as
                    | "SUPORTE"
                    | "MANUTENCAO"
                    | "CONSULTORIA"
                    | "TREINAMENTO"
                )
              }
            >
              <option value="SUPORTE">SUPORTE</option>
              <option value="MANUTENCAO">MANUTENÇÃO</option>
              <option value="CONSULTORIA">CONSULTORIA</option>
              <option value="TREINAMENTO">TREINAMENTO</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.buttonSubmit}>
              Criar Chamado
            </button>
            <button
              type="button"
              className={styles.buttonReset}
              onClick={handleReset}
            >
              Limpar Campos
            </button>
          </div>
        </motion.form>

        {/* Resumo */}
        <motion.aside
          className={styles.summaryBox}
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3>Resumo do Chamado</h3>
          <p>
            <FaClipboardList className={styles.icon} />
            <strong>Descrição:</strong>{" "}
            {descricao.trim() ? descricao : <em>Sem descrição</em>}
          </p>
          <p>
            <FaExclamationCircle className={styles.icon} />
            <strong>Prioridade:</strong> {prioridade}
          </p>
          <p>
            <FaTasks className={styles.icon} />
            <strong>Categoria:</strong>{" "}
            {categoria.charAt(0) + categoria.slice(1).toLowerCase()}
          </p>
        </motion.aside>
      </main>
    </div>
  );
};
