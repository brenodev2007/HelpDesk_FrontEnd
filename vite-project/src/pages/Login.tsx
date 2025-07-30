import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Buttom";
import api from "../services/api";
import axios from "axios";
import styles from "./styles/Login.module.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/clientes/login", {
        email,
        password: senha,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      window.location.href = "/criar-chamado";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Erro ao fazer login";
        toast.error(message);
        console.error("Erro ao fazer login:", message);
      } else {
        toast.error("Erro desconhecido ao fazer login");
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
          <img src={logo} alt="Logo" />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
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
          <Button type="submit">Entrar</Button>
          <p>
            Não tem conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
