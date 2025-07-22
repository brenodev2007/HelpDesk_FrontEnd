import React, { useState } from "react";
import { Header } from "../components/Header";
import { ProfileInfo } from "../components/ProfileInfo";
import { EditProfileForm } from "../components/EditProfileForm";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/User";
import styles from "./styles/Profile.module.css";

export const Profile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

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
          </div>
        </>
      )}
    </div>
  );
};
