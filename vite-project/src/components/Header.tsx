import React from "react";

import styles from "./styles/Header.module.css";
import logo from "../assets/logo-small.svg";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo" />
      <h1 className={styles.title}>Meu Perfil</h1>
    </header>
  );
};
