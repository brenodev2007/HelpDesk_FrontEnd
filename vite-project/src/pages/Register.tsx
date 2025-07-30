import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Buttom";
import styles from "./styles/Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import api from "../services/api";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/clientes/register", {
        email,
        password: senha,
        role: "USER",
      });

      console.log("Cadastro bem-sucedido:", response.data);

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Erro inesperado.";

        toast.error("Erro: " + serverMessage);
      } else {
        toast.error("Erro desconhecido");
      }
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className={styles.fundo_login}>
      <div className={styles.fundo_form}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Cadastro</h2>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button type="submit">Cadastrar</Button>
          <p>
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
