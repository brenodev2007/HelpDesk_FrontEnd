import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ProfileInfo } from "../components/ProfileInfo";
import { EditProfileForm } from "../components/EditProfileForm";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/User";
import styles from "./styles/Profile.module.css";

export const Profile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <p>Carregando perfil...</p>;
  }

  if (!user) {
    return <p>Você não está logado.</p>;
  }

  const handleSave = (updatedUser: User) => {
    console.log("Salvando usuário atualizado:", updatedUser);
    setIsEditing(false);
  };

  // Função para navegar conforme a role
  const handleHomeClick = () => {
    console.log("Role do usuário:", user.role);
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
      {isEditing ? (
        <EditProfileForm user={user} onSave={handleSave} />
      ) : (
        <>
          <ProfileInfo user={user} />
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.edit}`}
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
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
