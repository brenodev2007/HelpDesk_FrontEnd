import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./styles/MeusChamados.module.css";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";

interface Chamado {
  id: string;
  prioridade: string;
  descricao: string;
  chamado_servico: {
    servico: {
      nome: string;
    };
  }[];
}

export const MeusChamados: React.FC = () => {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await api.get("/clientes/chamados");
        setChamados(response.data);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      }
    };

    fetchChamados();
  }, []);

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.content}>
        <h1>Meus Chamados</h1>

        {chamados.length === 0 ? (
          <p>Você ainda não criou nenhum chamado.</p>
        ) : (
          <ul className={styles.chamadoList}>
            {chamados.map((chamado) => (
              <li key={chamado.id} className={styles.card}>
                <h2>
                  {chamado.chamado_servico?.[0]?.servico?.nome ??
                    "Serviço não disponível"}
                </h2>
                <p>
                  <strong>Status:</strong> {chamado.prioridade}
                </p>
                <p>
                  <strong>Descrição:</strong> {chamado.descricao}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
