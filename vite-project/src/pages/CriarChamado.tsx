import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import styles from "./styles/CriarChamado.module.css";

export const CriarChamado: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState<string>("");
  const [prioridade, setPrioridade] = useState<"BAIXA" | "MEDIA" | "ALTA">(
    "BAIXA"
  );
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
      console.log({ descricao, prioridade });
      const response = await api.post("/clientes/criar-chamado", {
        descricao,
        prioridade: prioridade.toUpperCase() as "BAIXA" | "MÉDIA" | "ALTA",
      });
      console.log(response);

      setMensagem("Chamado criado com sucesso!");
      setDescricao("");
      setPrioridade("BAIXA");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(error.response?.data?.error || "Erro ao criar chamado.");
      } else {
        setErro("Erro desconhecido ao criar chamado.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h2>Criar Chamado</h2>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="descricao">Descrição:</label>
            <br />
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              cols={40}
              required
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <label htmlFor="prioridade">Prioridade:</label>
            <br />
            <select
              id="prioridade"
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value as "BAIXA" | "MEDIA" | "ALTA")
              }
            >
              <option value="BAIXA">BAIXA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: 16 }}>
            Criar Chamado
          </button>
        </form>
      </main>
    </div>
  );
};
