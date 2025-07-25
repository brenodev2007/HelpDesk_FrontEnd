import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ProfileInfo } from "../components/ProfileInfo";
import { UpdateEmailForm } from "../components/EditProfileForm";
import { useAuth } from "../hooks/useAuth";
import styles from "./styles/Profile.module.css";

export const Profile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <p>Carregando perfil...</p>;
  }

  if (!user) {
    return <p>Você não está logado.</p>;
  }

  const handleHomeClick = () => {
    if (user.role === "TECNICO") {
      navigate("/tecnico");
    } else if (user.role === "USER" || user.role === "ADMIN") {
      navigate("/criar-chamado");
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      {isEditingEmail ? (
        <UpdateEmailForm onCancel={() => setIsEditingEmail(false)} />
      ) : (
        <>
          <ProfileInfo user={user} />
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.edit}`}
              onClick={() => setIsEditingEmail(true)}
            >
              Editar E-mail
            </button>
            <button
              className={`${styles.button} ${styles.logout}`}
              onClick={logout}
            >
              Logout
            </button>
            <button
              className={`${styles.button} ${styles.home}`}
              onClick={handleHomeClick}
              style={{ marginLeft: 12 }}
            >
              Home
            </button>
          </div>
        </>
      )}
    </div>
  );
};
