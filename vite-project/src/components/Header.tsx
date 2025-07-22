import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Header.module.css";
import logo from "../assets/fav-icon.svg";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home");
  };

  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo" />
      <h1 className={styles.title}>Meu Perfil</h1>
      <button onClick={goHome} className={styles.homeButton}>
        Home
      </button>
    </header>
  );
};
